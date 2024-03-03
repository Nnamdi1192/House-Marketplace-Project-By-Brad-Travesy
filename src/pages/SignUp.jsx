import React,{useState} from 'react'
import { Link, useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg"
import {db} from "../firebase.config";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';


const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const {name, email, password} = formData;

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id] : e.target.value
        })
    }

    const clearForm = () => {
        setFormData({
            name: "",
            email: "",
            password: ""
        });
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        let isValid = ([name, email, password].every(input => Boolean(input.trim())));
        // Validate use details
        if(!isValid){
            return toast.error("User Credentials not valid");
        }

        try{
            const auth = getAuth();
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {displayName: name});

            // Create user in database
            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            const userRef = doc(db, "users", userCredentials.user.uid);
            await setDoc(userRef, formDataCopy);

            clearForm();
            toast.success("User Created!");
            navigate("/profile");
        }catch(error){
            console.log(error.message);
            toast.error("User registration failed");    
        }

    }

    

   return (

    <div className='pageContainer'>
        <header className='pageHeader'>
            <p>Welcome!</p>
        </header>

        <form onSubmit={onSubmit}>
             <input type="text" className='nameInput' id="name" placeholder='Name' value={name} onChange={onChange}  />
            <input type="email" className='emailInput' id="email" placeholder='Email' value={email} onChange={onChange} />

            <div className='passwordInputDiv'>
                <input type={ showPassword ? "text" : "password" } id="password" className='passwordInput' value={password} placeholder='Password' onChange={onChange} />
                <img src={visibilityIcon} alt="show password" className='showPassword' onClick={() => setShowPassword(prevstate => !prevstate)}  />
            </div>
            <Link to={"/forgot-password"} className="forgotPasswordLink">Forgot Password</Link>
            <div className="signInBar">
                <p>Sign Up</p>
                <button className='signInButton'><ArrowRightIcon width="34px" height="34px"/></button>
            </div>
        </form>

        <OAuth />

        <Link to="/sign-in" className='registerLink'>Sign In Instead</Link>
    </div>
  )
}

export default SignUp