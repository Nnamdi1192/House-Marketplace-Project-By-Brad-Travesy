import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import googleIcon from "../assets/svg/googleIcon.svg"
import {toast} from "react-toastify"
import {db} from "../firebase.config"
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore"

const OAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const googleClick = async () => {
        try{
            const auth = getAuth();
            const provider = new GoogleAuthProvider();

            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            // Check if user exists
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if(!(await docSnap.exists())){
                await setDoc(userRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                });
            }
            navigate("/profile");
        }catch(error){
            toast.error("Authentication with google failed");
        }
    }

    return (

        <div className='socialLogin'>
            <p> Sign {location.pathname === "/sign-in" ? "in" : "out"} with</p>
            <button className='socialIconDiv'>
                <img className='socialIconImg' src={googleIcon} alt="sign in with google icon img" onClick={googleClick} />
            </button>
        </div>
    )
}

export default OAuth