import React, {useEffect, useState} from 'react'
import Spinner from '../components/Spinner';
import {toast} from "react-toastify";
import { db } from '../firebase.config';
import { collection, query, getDocs, where, limit, orderBy } from 'firebase/firestore';
import ListingItem from '../components/ListItem';


const Offers = () => {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {

            try{

                // Fetch docs ref
                const collectionRef = collection(db, "listings");
                // Build Query
                const q = query(collectionRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(10));
                // Get collection snapshot
                const listings = [];
                const querySnap = await getDocs(q);
                querySnap.forEach((doc) => {
                    return listings.push(
                        {
                            id: doc.id,
                            data: doc.data()
                        }
                    )   
                })
                setListings(listings);
                setLoading(false);
            }catch(err){
                console.log(err.message);
                toast.error("No Listing Found");
            }

        }
        fetchListings();
    })

  return (
    <div className='category'>
        <header>
            <p className='pageHeader'>Offers</p>    
        </header>

        {loading ? <Spinner/> : listings && listings.length > 0 ? (
        <>
            <main>
                <ul className='categoryListings'>
                    {listings.map((listing) => (
                        <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                    ))}
                </ul>
            </main>    
        </>
        ) : <p>No Offer</p>}
    </div>
  )
}

export default Offers