import React, { useEffect } from 'react'
import { useState } from 'react'
import {useLocation,Link} from 'react-router-dom'
import './Yourorders.css'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'

const Yourorders =  () => {

  const {all_product} = useContext(ShopContext)
  const [cartItems, setCartItems] = useState([]);


  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const items = params.get('items')

  // setCartItems(JSON.parse(decodeURIComponent(items)))

  useEffect(() => {
    const clearCart = async () => {
      if (items) {
        if (localStorage.getItem('auth-token')) {
          await fetch('http://localhost:4000/clearcart', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'auth-token': `${localStorage.getItem('auth-token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), 
          });
        }
        setCartItems(JSON.parse(decodeURIComponent(items)));
      }
    };

    clearCart();
  }, [items]);

  const findImage = (id)=>{
    const product = all_product.find((e)=> e.id === Number(id))
    return product? product.image:' '
  }

  return (
    <div className='your-orders'>
      <h1 className='main'>Your Orders</h1>
      <hr/>
      <div className='order-list'>
      {
        cartItems.map((item, index) => (
           <div className='top'>
            <div key={index} className='order-item'>
            <div className='description'>
              <div className='name'>
                <h1>{item.name}</h1> 
                <div>{item.quantity}</div>
              </div>
              <div className='btn'>
                <button id='review'>ADD REVIEW</button>
                <Link to={`/product/${item.id}`}><button id='viewproduct'>VIEW PRODUCT</button></Link>
              </div>
            </div>
            <img  src={findImage(item.id)} alt=''/>
           </div>
           <hr/>
           </div>
        ))
      }
      </div>
    </div>
  )
}

export default Yourorders