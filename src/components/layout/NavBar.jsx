import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import {ReactComponent as OfferIcon} from "../../assets/svg/localOfferIcon.svg";
import {ReactComponent as ExploreIcon} from "../../assets/svg/exploreIcon.svg";
import {ReactComponent as PersonIcon} from "../../assets/svg/personOutlineIcon.svg"

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const pathMatchRoute = (curPath) => {
        return location.pathname === curPath;
    }


  return (
    <footer className='navbar'>
        <nav className='navbarNav'>
            <ul className="navbarListItems">
                <li className="navbarListItem" onClick={() => navigate("/")}>
                    <ExploreIcon fill={pathMatchRoute("/") ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px" />
                    <p className={pathMatchRoute("/") ? 'navbarListItemNameActive' : "navbarListItemName"}>Explore</p>
                </li>

                <li className='navbarListItem' onClick={() => navigate("/offers")}>
                    <OfferIcon fill={pathMatchRoute("/offers") ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px" />
                    <p className={pathMatchRoute("/offers") ? 'navbarListItemNameActive' : "navbarListItemName"}>Offers</p>
                </li>

                <li className='navbarListItem' onClick={() => navigate("/profile")}>
                    <PersonIcon fill={pathMatchRoute("/sign-in") ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px" />
                    <p className={pathMatchRoute("/sign-in") ? 'navbarListItemNameActive' : "navbarListItemName"}>Profile</p>
                </li>
            </ul>
        </nav>
    </footer>
  )
}

export default NavBar