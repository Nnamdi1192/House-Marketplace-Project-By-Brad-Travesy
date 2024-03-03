import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from '../components/OAuth';
import {toast} from "react-toastify"
import { getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';


const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false); 
    const [formData, setFormData] = useState({
    email: "",
    password: ""
  });  
  const navigate = useNavigate();
  const {email, password} = formData;

  const onChange = (e) => {
    setFormData({
        ...formData,
        [e.target.id] : e.target.value
    })
  }

  const onSubmit = async (e) => {
        e.preventDefault();

        let inputIsValid = [email, password].every(input => Boolean(input.trim()));
        if(!inputIsValid){
            return toast.error("User credential not valid!");
        }

        try{
            const auth = getAuth();
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            if(userCredentials.user){
                navigate("/profile");   
                toast.success("user logged In!");
            }
        }catch(err){
            console.log(err.message);
            toast.error("User Sign in failed!");
        }
       
  }

  return (

    <div className='pageContainer'>
        <header className='pageHeader'>
            <p>Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
            <input type="email" className='emailInput' id="email" placeholder='Email' value={email} onChange={onChange} />

            <div className='passwordInputDiv'>
                <input type={showPassword ? "text" : "password"} id="password" className='passwordInput' value={password} placeholder='Password' onChange={onChange} />
                <img src={visibilityIcon} alt="show password" className='showPassword' onClick={() => setShowPassword(prevState => setShowPassword(!prevState))}  />
            </div>
            <Link to={"/forgot-password"} className="forgotPasswordLink">Forgot Password</Link>
            <div className="signInBar">
                <p>Sign Up</p>
                <button className='signInButton'><ArrowRightIcon width="34px" height="34px"/></button>
            </div>
        </form>

       <OAuth />

        <Link to="/sign-up" className='registerLink'>Sign Up Instead</Link>
    </div>
  )
}

export default SignIn