import React,{ useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth';
import {updateDoc, doc, collection, getDocs, where, query, orderBy, deleteDoc} from "firebase/firestore"
import {useNavigate} from 'react-router-dom'
import {db} from '../firebase.config'
import {toast} from "react-toastify"
import homeIcon from '../assets/svg/homeIcon.svg'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import Spinner from '../components/Spinner';
import ListItem from '../components/ListItem'






const Profile = () => {
  const auth = getAuth();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const navigate = useNavigate();

  const {name, email} = formData;

  const logout = () => {
    // Logout
    auth.signOut();
    navigate("/");
  }

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    });
  }

  const  onSubmit = async () => {
      if(auth.currentUser.displayName !== name){
        console.log(auth.currentUser.displayName, name);
          try{
              // Update User auth profile
              await updateProfile(auth.currentUser, {displayName: name});

              // Update user firestore details
              const docRef = doc(db, "users", auth.currentUser.uid);
            
              await updateDoc(docRef, {name})
              toast.success("User details Updated!");
          }catch(err){
              toast.error("Update failed!");
              console.log(err.message);
          }
          
      }
  }

  const onDelete = async (listingId) => {
    try{
        // setLoading(true);
       let cfm = (window.confirm('Are You Sure You Want To Delete This Listing?'));
       if(cfm){
        await deleteDoc(doc(db, 'listings', listingId));
        const listingCopy = listings.filter(listing => listing.id !== listingId);
        setListings(listingCopy);
        // setLoading(false)
       }
       
    }catch(err){
      console.log(err.message);
      toast.error('Failed To Delete Listing');
    }
  }

  
  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
 }

  useEffect(() => {
    const fetchListings = async () => {
        const collRef = collection(db, 'listings');
        const q = query(collRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));
        const querySnap = await getDocs(q);

        let dbListings = [];

        querySnap.forEach((doc) => {
          return dbListings.push({
            id: doc.id,
            data: doc.data()
          });
        })

        setListings(dbListings);
        setLoading(false);
    }

    try{
      fetchListings();
    }catch(error){
      console.log(error.message);
      toast.error('No item found');
    }

    
  }, [auth])

  if(loading) return <Spinner/>
  
  return <div className='profile'>
    <header className='profileHeader'>
      <p className='pageHeader'>My Profile</p>
      <button type='button' className='logOut' onClick={logout}>Logout</button>
    </header>

    <main>
      <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p className='changePersonalDetails' onClick={
            () => {
              setChangeDetails(prevState => !prevState);
              changeDetails && onSubmit();
            }
          }>
            {changeDetails ? "Save Changes" : "Edit User Details"}
          </p>
      </div>

      <div className='profileCard'>
        <form>
          <input 
            type="text" 
            id="name" 
            value={name} 
            className={!changeDetails ? "profileName" : "profileNameActive"}
            disabled={!changeDetails}
            onChange={onChange}
          />

          <input 
            type="text" 
            id="email" 
            value={email}
            className={!changeDetails ? "profileEmail" : "profileEmailActive"}
            disabled={!changeDetails}
            onChange={onChange}
          />
        </form>
      </div>
      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt='home'/>
        <p>sell or rent your home</p>
        <img src={arrowRight} alt='arrow right' />
      </Link>

      {!loading && listings.length > 0 && (
        <>
            <p className='listingText'>Your  Listings</p>
            <ul className='listingList'>
              {
                listings.map(({id, data}) => <ListItem key={id} id={id} listing={data} onDelete={() => onDelete(id)} onEdit={onEdit} /> )
              }
            </ul>
        </> 
      )}
    </main>
  </div>
}

export default Profile