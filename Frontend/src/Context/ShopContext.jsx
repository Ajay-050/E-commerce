import React, { createContext, useEffect, useState } from "react";


const getDefaultcart = ()=>{
    let cart = {}
    for(let index=0;index<300+1;index++){
        cart[index] = 0
        // {"0":0,"1":0,"2":0,"3":0,...........}
    }
    // In the first case (cart.index = 0), 'index' is added as a property name with the value 0.
    // In the second case (cart[index] = 0), index is evaluated (here, 1), and 1 is added as a property name with the value 0.
    
    return cart
}

export const ShopContext = createContext(null); 

const ShopContextProvider = (props) => { 

    const [all_product,setAllproduct] = useState([])

    const [cartItems,setCartItems] = useState(getDefaultcart)

    useEffect(()=>{
        fetch("http://localhost:4000/allproducts")
        .then((resp)=>resp.json())
        .then((data)=>{setAllproduct(data)})

        if(localStorage.getItem('auth-token')){
            fetch("http://localhost:4000/getcart",{
                method:"POST",
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",

            })
            .then((resp)=>resp.json())
            .then((data)=>{setCartItems(data)})
        }
    },[])


    //* this way of updating state is called functional update and when doing this you always return a new state
    // you don't have to return when doing direct updation of state.

    // const addToCart = (itemId)=>{
    //     setCartItems((prev)=>{
    //         return  {...prev,[itemId]:prev[itemId]+1}
    //     })
    // }

    // example for direct update state: "setProductDetails({...ProductDetails,[e.target.name]:e.target.value})".

    //* we can write above function like this too
    const addToCart = (itemId) => {

        setCartItems((previous)=>({...previous,[itemId]:previous[itemId]+1}))

        if(localStorage.getItem('auth-token')){
            fetch("http://localhost:4000/addtocart",{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((resp)=>resp.json())
            .then((data)=>console.log(data))
        }
        
    }
    // wrapping up the object within paranthesis will return the object directly.

    const removeFromCart = (itemId) => {

        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))

        if(localStorage.getItem('auth-token')){
            fetch("http://localhost:4000/removefromcart",{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((resp)=>resp.json())
            .then((data)=>console.log(data))
        }

    }

    const getTotalCartAmount = () => {

        let totalAmount = 0
 
        for(const item in cartItems){
            console.log(`${item} : ${cartItems[item]}`)
            if(cartItems[item]>0){
                const itemInfo = all_product.find((product)=>product.id === Number(item))
                if(itemInfo){
                    totalAmount += itemInfo.new_price*cartItems[item]
                }
            }
        }
        return totalAmount
    }

    const getTotalCartItems = () => {

        let totalItems = 0

        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItems += cartItems[item]
            }
        }
        return totalItems
    }

    const contextValue = {all_product,cartItems,addToCart,removeFromCart,getTotalCartAmount,getTotalCartItems}
    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )

    
}

export default ShopContextProvider