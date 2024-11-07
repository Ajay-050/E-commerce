import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../item/Item'

const NewCollections = () => {

  const [newcollection,setCollection] = useState([])

  useEffect(()=>{
    fetch("http://localhost:4000/newcollection")
    .then((resp)=>resp.json())
    .then((data)=>{setCollection(data)})
  },[])

  return (
    <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr/>
        <div className="collections">
            {
                newcollection.map((item,i)=>
                    <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price }/>
                )
            }
        </div> 
    </div>
  )
}

export default NewCollections