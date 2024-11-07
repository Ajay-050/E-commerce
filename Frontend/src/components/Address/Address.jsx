import React,{useContext} from 'react'
import './styles.css'
import { ShopContext } from '../../Context/ShopContext'




const Address = () => {

    const {all_product,cartItems} = useContext(ShopContext)

    let items = []

    // eslint-disable-next-line array-callback-return
    all_product.map(product=>{
        if(cartItems[product.id]>0){
            let item = {
                id:product.id,
                name:product.name,
                price:product.new_price,
                quantity:cartItems[product.id]
            }
            items.push(item)
        }
    })


const payment = async()=>{
    try {
        console.log("hi")
        const res = await fetch("http://localhost:4000/payment",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            mode:"cors",
            body:JSON.stringify({items:items})
        })
        const data = await res.json()
        window.location = data.url 

    } catch (error) {
        console.log(error)
        
    }
}

  return (
    <div className='address-container'>
        <h1>Fill your address details here</h1>
        <div className='address'>
            <div className='name'>
                <input id='firstname' placeholder='First Name'></input>
                <input id='lastname' placeholder='Last Name'></input>
            </div>
            <textarea placeholder='Enter Address'></textarea>
            <div className='area'>
                <input id='city' placeholder='city'></input>
                <input id='state' placeholder='state'></input>
            </div>
            <div className='zip'>
                <input id='postal' placeholder='Postal code'></input>
                <input id='ziip' placeholder='Mobile Number'></input>
            </div>
            <div className='payment'>
                <button onClick={payment}>CONTINUE TO PAYMENT</button>
            </div>
        </div>
    </div>
  )
}

export default Address