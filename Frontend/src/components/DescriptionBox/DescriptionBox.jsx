import React, { useState } from 'react'
import './DescriptionBox.css'

const DescriptionBox = (props) => {

    const {product} = props
    const reviewArray = product.review

    const [isReview,setReview] = useState(false)

  return (

    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div onClick={()=>setReview(false)} className="descriptionbox-navbox">Description</div>
            <div onClick={()=>setReview(true)} className="descriptionbox-navbox fade">Reviews(122)</div> 
        </div>
        {
            isReview? 
            ( 
              <div className='descriptionbox-review'>
                {
                    reviewArray.map((review)=>(
                        <div className='review-element'>
                            <h3>{review.reviewer}</h3>
                            <p>{review.comment}</p>
                            <h4>{review.date}</h4>
                        </div>
                    ))
                }
              </div>  
            ):
            (
                <div className="descriptionbox-description">
                    <p>
                        An e-commerce website is an online platform that enables businesses to sell products or services
                        directly to consumers over the internet. It provides a virtual storefront where customers can browse
                        products, view details, and make purchases securely using various payment methods. E-commerce websites
                        typically include features such as product catalogs, shopping carts, and order processing systems.
                        They offer the convenience of shopping from anywhere at any time, often with additional functionalities
                        like customer reviews, product recommendations, and customer support.
                    </p>
                    <p>
                        Additionally, e-commerce websites often incorporate marketing tools such as email campaigns,
                        discount codes, and loyalty programs to attract and retain customers. They can also include advanced 
                        analytics to track user behavior and sales performance, helping businesses optimize their strategies
                        and improve customer experiences.
                    </p>
                </div>
            )
        }
    </div>
  )
}

export default DescriptionBox