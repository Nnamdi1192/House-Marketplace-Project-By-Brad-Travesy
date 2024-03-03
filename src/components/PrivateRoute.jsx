import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import {useAuthStatus} from "../hooks/useAuth"
import Spinner from "../components/Spinner"

const PrivateRoute = () => {
  const [isLoading, userIsLoggedIn] = useAuthStatus();

  if(isLoading) return <Spinner/>

  return userIsLoggedIn ? <Outlet/> : <Navigate to={"/sign-in"}/>
}

export default PrivateRoute