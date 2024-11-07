import React, { useState } from 'react'

import './UpdateProduct.css'

const UpdateProduct = () => {

  let initialProduct = {
    "id":-1,
    "name":"",
    "image":"",
    "new_price":"",
  }

  const [product,setProduct] = useState(initialProduct)
  const [isFetched,setisFetched] = useState(false)
  const [image,setImage] = useState(false)

  const handleInput = async (e)=>{
    // console.log(e.target.value)

    let id = e.target.value
    const response = await fetch("http://localhost:4000/fetchproduct",{
        method:"POST",
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify({id:id})
    })
    if(!response.ok){
      throw new Error('Cannot fetch the product. Check your product Id.');
    }
    const data = await response.json();

    const serverProduct = {
      id: data.id,
      name: data.name,
      image: data.image,
      new_price: data.new_price.toString(),
    };
    setProduct(serverProduct);
    setisFetched(true)
  }

  const handleImage = (e)=>{
    setImage(e.target.files[0])
  }

  const handleChange = (e) =>{
      const {name,value} = e.target
      setProduct((prevProduct)=>({
          ...prevProduct,
          [name]:value,
      }))
  }

  const handleSubmit = async (e)=>{

      console.log("hi")

      e.preventDefault()

      const updatedProduct = {
        ...product,
        new_price:Number(product.new_price)
      }
      const response = await fetch("http://localhost:4000/updateproduct",{
          method : "POST",
          headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(updatedProduct)
      })
      if (!response.ok) {
        throw new Error('Cannot Update Product');
      }
      const data = await response.json()
      alert('Product updated successfully');
  }

  return (
    <div>
      <input onChange={handleInput} id='proId' placeholder='Enter Id'></input>
      {
        isFetched &&
        <form  onSubmit={handleSubmit}>
          <div className='prod-details'>
            <div className='pName'>
              <label>Product Name:</label>
              <input type='text' name='name' value={product.name} onChange={handleChange}/>
            </div>
            <div className='pImage'>
              <label htmlFor='file-input'>
                <img src={image?URL.createObjectURL(image):product.image} id='thumbnail-img'/>
              </label>
              <input onChange={handleImage} name='image' id='file-input' type='file' hidden/>
            </div>
            <div className='pPrice'>
              <label>Product Price</label>
              <input onChange={handleChange} type='number' name='new_price' value={product.new_price}/>
            </div>
            <div className='submit'>
              <button type='submit'>SAVE</button>
            </div>
          </div>
        </form>
      }
    </div>
  )
}

export default UpdateProduct