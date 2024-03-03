import React, {useState, useRef, useEffect} from 'react';
import {useParams, useSearchParams} from 'react-router-dom'
import {getAuth} from 'firebase/auth'
import {doc, getDoc} from 'firebase/firestore'
import { db } from '../firebase.config';
import {toast} from 'react-toastify'




const Contact = () => {
    const [landLord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const {listingId} = useParams();
    let [searchParams, setSearchParams] = useSearchParams('listingName');
    const isMounted = useRef(true);

    const onChange = (e) => {
        setMessage(e.target.value);
    }


    useEffect(() => {
        const getLandlordDetails = async () => {
            const docRef = doc(db, 'users', listingId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                setLandlord(docSnap.data());
            }else{
                toast.error('Failed to Fetch Landlord\'s details');
            }
        }

        if(isMounted){
            getLandlordDetails();
            return () => isMounted.current = false;
        }
    }, [listingId]);
   
  return (
    <div className='pageContainer'>
        <header>
            <p className='pageHeader'>Contact Landlord</p>
        </header>
        {landLord !== null && (
            <main>
                <div className='contactLandlord'>
                    <p className='landlordName'>Contact {landLord?.name}</p>
                </div>

                <form className='messageForm'>
                    <div className='messageDiv'>
                        <label htmlFor='message' className='messageLabel'>Message</label>
                        <textarea name='message' id="message" class Name='textarea' value={message} onChange={onChange} rows={5}></textarea>
                    </div>

                    <a href={`mailto:${landLord.email}?subject=${searchParams.get('listingName')}&body=${message}`}><button type="button" className='primaryButton'>Send Mail</button></a>
                </form>
            </main>
        )}
    </div>
  )
}

export default Contact