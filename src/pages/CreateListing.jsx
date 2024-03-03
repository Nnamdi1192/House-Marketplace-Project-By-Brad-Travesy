import { useState } from "react";
import {toast} from 'react-toastify';
import {uploadBytesResumable, getStorage, ref, getDownloadURL} from 'firebase/storage'
import { getAuth } from "firebase/auth";
import {v4 as uuidv4} from 'uuid';
import Spinner from "../components/Spinner"
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {db} from "../firebase.config"
import { useNavigate } from "react-router-dom";


const CreateListing = () => {
    // eslint-disable-next-line
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(
        {
            type: 'rent',
            name: '',
            bedrooms: 1,
            bathrooms: 1,
            parking: false,
            furnished: false,
            address: '',
            offer: false,
            regularPrice: '',
            discountedPrice: '',
            image: {},
            latitude: 0,
            longitude: 0
        }
    );
    const auth = getAuth();
    const navigate = useNavigate();

    const {type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, image, latitude, longitude} = formData;

    const onMutate = (e) => {
        let boolean;

        if(e.target.value === 'false') boolean = false;

        if(e.target.value === 'true') boolean = true;

        if(e.target.files){
            setFormData(prevstate => ({
                ...prevstate,
                image: e.target.files
            }))
        }

        if(!e.target.files){ 
            setFormData(prevstate => (
                {
                    ...prevstate,
                    [e.target.id] : boolean ?? ((e.target.type === 'number') ? Number(e.target.value) : e.target.value)
                }
            ))
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        // Save Image
        const storeImage = async (imageFile) => {
            return new Promise((resolve, reject) => {
                // build image file name
                const fileName =  `${auth.currentUser.uid}-${imageFile.name}-${uuidv4()}`;
                const storage = getStorage();
                const imageRef = ref(storage, `images/${fileName}`);

                const uploadTask = uploadBytesResumable(imageRef, imageFile);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log(`Uploaded ${imageFile.name}  ${progress} %`);
                    },
                    (error) => reject(error),
                    () => getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => resolve(downloadURL))
                )
            });
        }

        // Geolocation
        let geolocation = {};
        let location = '';
        if(geolocationEnabled){
            // Use geolocation api
             const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODING_API_KEY}`);
             const data = await response.json();
             if(data.status === 'OK'){
                geolocation.lat = data.results[0].geometry.location.lat;
                geolocation.lng = data.results[0].geometry.location.lng;

                location = data.status === 'ZERO_RESULTS' ? 'undefined' : data.results[0].formatted_address;

                if(location === 'undefined' || location.includes('undefined')) return toast.error('Please enter correct address');
                console.log(geolocation, location)
             }
        }else{
            geolocation.lng = longitude;
            geolocation.lat = latitude;
            location = address;
        }

        // clean data


        try{
            setLoading(true);

             // Ensure Discounted price is less than Regular price
            if(discountedPrice >= regularPrice) {
                setLoading(false);
                return toast.error('Discounted price should be less than your regular price');
            }

            // Ensure submitted image fil is less than 6
            if(Boolean(image) && image.length > 6) {
                 setLoading(false);
                 return toast.error('Maximum number of images acceptable is 6')
            };

            storeImage(image[0]).then(downloadUrl => console.log(downloadUrl));
            //Get all image URL
            const imageUrls = await Promise.all([...image].map(image => storeImage(image))).catch(err => console.log(err));

            //build data for storage
            const formDataCopy = {
                ...formData,
                imageUrls ,
                location,
                geolocation,
                userRef: auth.currentUser.uid,
                timestamp: serverTimestamp()
            };

            delete formDataCopy.image;
            delete formDataCopy.address;
            if(!offer) delete formDataCopy.discountedPrice;

            const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
            console.log(docRef.id);  
            setLoading(false);
            navigate(`/single-listing/${type}/${docRef.id}`);
        }catch(err){
            setLoading(false);
            console.log(err.message);
            toast.error('Image not uploaded');
            return;
        }
    }

    if(loading) return <Spinner/>
    
  return (
    <div className='profile'>
        <header>
            <p className='pageHeader'>Create a Listing</p>
        </header>

        <main>
            <form onSubmit={onSubmit}>
                <label className='formLabel'>Sell / Rent</label>
                <div className='formButtons'>
                    <button 
                        className={type === 'sale' ? 'formButtonActive' : 'formButton'} 
                        type="button"
                        id='type'
                        value='sale'
                        onClick={onMutate}
                    >Sell</button>

                    <button
                        className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                        type="button"
                        id="type"
                        value='rent'
                        onClick={onMutate}
                    >Rent</button>
                </div>
                <div>
                    <label className='formLabel'>Name</label>
                    <input 
                        className='formInputName'
                        type="text"
                        id="name"
                        value={name}
                        minLength={10}
                        maxLength={32}
                        onChange={onMutate}
                        required
                    />
                </div>
                <div className='formRooms flex'>
                    <div>
                        <label className='formLabel'>Bedrooms</label>
                        <input 
                           className='formInputSmall'
                           type="number"
                           id='bedrooms'
                           value={bedrooms}
                           onChange={onMutate}
                           min="1"
                           max='50'
                           required
                        />
                    </div>

                    <div>
                        <label className='formLabel'>Bathrooms</label>
                        <input 
                           className='formInputSmall'
                           type="number"
                           id='bathrooms'
                           value={bathrooms}
                           onChange={onMutate}
                           min="1"
                           max='50'
                           required
                        />
                    </div>
                </div>

                <label className='formLabel'>Parking spot</label>
                <div className='formButtons'>
                    <button
                    type="button"
                        className={parking ? 'formButtonActive' : "formButton"}
                        id="parking"
                        value={true}
                        onClick={onMutate}
                    >Yes</button>

                    <button
                        type="button"
                        className={!parking ? "formButtonActive" :"formButton"}
                        id="parking"
                        value={false}
                        onClick={onMutate}
                    >No</button>
                </div>

                <label className='formLabel'>Furnished</label>
                <div className='formButtons'>
                    <button
                    className={furnished ? 'formButtonActive' : 'formButton'}
                    type='button'
                    id='furnished'
                    value={true}
                    onClick={onMutate}
                    >
                    Yes
                    </button>
                    <button
                    className={!furnished ? 'formButtonActive' :'formButton'}
                    type='button'
                    id='furnished'
                    value={false}
                    onClick={onMutate}
                    >
                    No
                    </button>
                </div>

                <label className='formLabel'>Address</label>
                <textarea
                    className='formInputAddress'
                    type='text'
                    id='address'
                    value={address}
                    onChange={onMutate}
                    required
                />

                {!geolocationEnabled && (
                    <div className='formLatLng flex'>
                        <div>
                            <label className='formLabel'>Latitude</label>
                            <input 
                                className='formInputSmall'
                                type='number'
                                id='latitude'
                                value={latitude}
                                onChange={onMutate}
                                required
                            />
                        </div>

                        <div>
                            <label className='formLabel'>Longitude</label>
                            <input 
                                className='formInputSmall'
                                type='number'
                                id='longitude'
                                value={longitude}
                                onChange={onMutate}
                                required
                            />
                        </div>
                    </div>
                )}

                <label className='formLabel'>Offer</label>
                <div className='formButtons'>
                    <button
                    className={offer ? 'formButtonActive' : 'formButton'}
                    type='button'
                    id='offer'
                    value={true}
                    onClick={onMutate}
                    >
                    Yes
                    </button>
                    <button
                    className={!offer ? 'formButtonActive' : 'formButton'}
                    type='button'
                    id='offer'
                    value={false}
                    onClick={onMutate}
                    >
                    No
                    </button>
                </div>

                <label className='formLabel'>Regular Price</label>
                <div className='formPriceDiv'>
                    <input
                    className='formInputSmall'
                    type='number'
                    id='regularPrice'
                    value={regularPrice}
                    onChange={onMutate}
                    min='50'
                    max='1000000'
                    required
                    />
                    {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                </div>

                {offer && (
                    <>
                        <label className='formLabel'>Discounted Price</label>
                        <input 
                            className='formInputSmall'
                            type='number'
                            id='discountedPrice'
                            value={discountedPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required={true}
                        />
                    </>
                )}

                <label className='formLabel'>Images</label>
                <p>The first image will be the cover (max 6)</p>
                <input 
                    className='formInputFile'
                    type='file'
                    id='images'
                    onChange={onMutate}
                    max='6'
                    accept='.jpg,.png,.jpeg'
                    multiple
                    required
                />

                <button type='submit' className='primaryButton createListingButton'>Create Listing</button>
            </form>
        </main>
    </div>
  )
}

export default CreateListing