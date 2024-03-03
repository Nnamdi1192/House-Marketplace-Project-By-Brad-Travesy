import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail, auth, getAuth } from 'firebase/auth'; 
import {toast} from "react-toastify"
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const onChange = (e) => setEmail(e.target.value); 

  const onSubmit = async (e) => {
      e.preventDefault();
      try{
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email)
        toast.success("Password reset email sent!");
      }catch(err){
        toast.error("Unable to send password reset email!");
        console.log(err.message);
      }
  }

  return (
    <div className='pageContainer'>
      <header className="pageHeader">Forgot Password</header>

      <main>
        <form onSubmit={onSubmit}>

          <input 
            type="text"   
            className="emailInput" 
            placeholder='Email'
            id="email"
            value={email}
            onChange={onChange}
          />

          <Link to="/sign-in" className='forgotPasswordLink'>Sign In</Link>

          <div className='signInBar'>
            <div className='signInText'>Send Reset Link</div>
            <button className='signInButton'>
              <ArrowRightIcon fill='#FFF' width="34px" height="34px" />
            </button>
          </div>
        </form>
      </main>
    </div>

  )
}

export default ForgotPassword