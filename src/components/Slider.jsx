import React, {useEffect, useState} from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Navigation, Scrollbar, Pagination, A11y} from 'swiper/modules'
import 'swiper/css/bundle'
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import { db } from '../firebase.config'
import Spinner from './Spinner'
import { useNavigate } from 'react-router-dom'

const Slider = () => {

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
            const fetchListings = async () => {
            const docRef = collection(db, 'listings');
            const q = query(docRef, orderBy('timestamp', 'desc'), limit(5));
            const querySnapShot = await getDocs(q);

            const listing = [];

            querySnapShot.forEach((doc) => {
                return listing.push({
                    id: doc.id,
                    data: doc.data()
                });
            })

            setListing(listing)
            setLoading(false);
        }

        fetchListings();
    }, [])

    if(loading) return <Spinner/>

    if(listing.length === 0) return <></>

  return (listing && (<>
    <p className='exploreHeading'>Recommended</p>
    <Swiper 
        modules={[Pagination, Navigation, Scrollbar, A11y]}
        slidesPerView={1}
    >
        {listing.map(({id, data})=> (
            <SwiperSlide 
                key={id}
                onClick={() => navigate(`/single-listing/${data.type}/${id}`)}
            >
                <div className='swiperSlideDiv' style={{background: `url(${data.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover', height: '350px', width: '100%'}}></div>
                <p className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePrice'>{data.discountedPrice ?? data.regularPrice}{ " " }{data.type === 'rent' && '/month'}</p>
            </SwiperSlide>
        ))}
    </Swiper>
  </>))
}

export default Slider