import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import {db} from "../firebase.config"
import { getDoc, doc } from 'firebase/firestore';
import {getAuth} from 'firebase/auth'
import shareIcon from "../assets/svg/shareIcon.svg"
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';

const SingleListing = () => {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const {categoryType, listingId} = useParams();
    const auth = getAuth();

    useEffect(() => {
        const fetchListing =  async () => {
            const docRef = doc(db, 'listings', listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setLoading(false);
                setListing(docSnap.data())
            }
        }

        fetchListing();
    }, [listingId]);


    if(loading) return <Spinner/>
 
    return (
        <main>
            <Swiper 
                slidesPerView={1}
                pagination={{clickable: true}}
                scrollbar={{draggable: true}}
                modules={[Navigation, Pagination, A11y]}
            >
                {listing.imageUrls.map((img, index) => (
                    <SwiperSlide key={index} style={{background: `url(${img}) center`, backgroundSize: 'cover', backgroundPosition: 'center', height: '300px', width: '100%'}}></SwiperSlide>
                ))}
            </Swiper>
           <div className='shareIconDiv'>
               <img src={shareIcon} alt='' onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareLinkCopied(true);
                    setTimeout(() => setShareLinkCopied(false), 2000);
               }} />
           </div>

           {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

           <div className='listingDetails'>
                <p className='listingName'>
                    {listing.name} - ${listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
                <p className='listingLocation'>{listing.location}</p>
                <p className='listingType'>{listing.type === 'rent' ? 'Rent' : 'Sell'}</p>
                {listing.offer && (<p>
                    ${listing.regularPrice - listing.discountedPrice} discount
                </p>)}

                <ul className='listingDetailsList'>
                    <li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}</li>
                    <li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</li>
                    <li>{listing.parking && 'Parking Spot'}</li>
                    <li>{listing.furnished && 'Furnished'}</li>
                </ul>

                <p className="listingLocationTitle">Location</p>

                <div className='leafletContainer' >
                    <MapContainer center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={true} style={{width: '100%', height: '300px'}}>
                        <TileLayer 
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        />
                        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                            <Popup>
                                {listing.location}
                            </Popup>
                        </Marker>
                    </MapContainer>   
                </div>
                {auth.currentUser?.uid !== listing.userRef && (<Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>Contact Landlord</Link>)}
           </div>
        </main>
  )
}

export default SingleListing