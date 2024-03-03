import React from 'react'
import { Link} from 'react-router-dom'
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg"
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg"
import Slider from '../components/Slider'


const Explore = () => {


  return (
    <div className='explore'>
      <header className="pageHeader">
        <p>Explore</p>
      </header>

      <main>
        <div className="exploreSlide">
            <Slider/>
        </div>

        <p className='exploreCategoryHeading'>Categories</p>

        <div className='exploreCategories'>

          <Link to="/category/rent">
            <img src={rentCategoryImage} alt='rent' className='exploreCategoryImg'/>
            <p className='exploreCategoryName'>Place For Rent</p>
          </Link>

          <Link to="/category/sale">
            <img src={sellCategoryImage} alt='sell' className='exploreCategoryImg'/>
            <p className='exploreCategoryName'>Place For Sale</p>
          </Link>
        
        </div>  
       
      </main>
    </div>
  )
}

export default Explore