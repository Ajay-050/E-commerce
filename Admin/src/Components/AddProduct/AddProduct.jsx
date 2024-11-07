import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useState } from 'react'

const AddProduct = () => {
    
    const [image,setImage] = useState(false)
    const [ProductDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:"",
    })

    const imageHandler = (e) =>{
        setImage(e.target.files[0])
        // console.log(e.target.files)
    }
    const changeHandler = (e) =>{
        setProductDetails({...ProductDetails,[e.target.name]:e.target.value})
    }

    //* [e.target.name] : e.target.value #computed property.
    // Since name is "name" in "<input type='text' name='name' placeholder='Type Here'/>"
    // the computed property [name]: value becomes "name": value. 
    // The result is a new object that copies all properties from prevDetails and 
    // updates the "name" property with the new value from the input field.

    //*why?
    // The key point is that [name]: value dynamically assigns the property name based on the input 
    // element’s name attribute, allowing the changeHandler to update different properties of the state object
    // based on which input field is being modified.

    const AddProduct =  async ()=>{
        let responseData
        let product = ProductDetails
        
        let formData = new FormData()
        formData.append('product',image)
        // console.log(formData)

        await fetch("http://localhost:4000/upload",{
            method:"POST",
            headers:{
                Accept:'application/json',
            },
            body:formData,
        }).then((resp)=>resp.json()).then((data)=>{responseData=data})

        if(responseData.success){
            product.image=responseData.imageUrl
            // console.log(product)
            await fetch("http://localhost:4000/addproduct",{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product)
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product Added"):alert("Failed")
            })
        }
    }

  return (
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p>Product Title</p>
            <input value={ProductDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type Here'/>
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                 <p>Price</p>
                 <input value={ProductDetails.old_price} onChange={changeHandler} type='text' name='old_price' placeholder='Type Here'/>
            </div>
            <div className="addproduct-itemfield">
                 <p>Offer Price</p>
                 <input value={ProductDetails.new_price} onChange={changeHandler} type='text' name='new_price' placeholder='Type Here'/>
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={ProductDetails.category} onChange={changeHandler } name='category' className='add-product-selector'>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">

            <label htmlFor='file-input'>
                <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt=''/> 
            </label>
            <input onChange={imageHandler} type='file' name='image' id='file-input' hidden/>

            {/* 
                  image starts with a value of false.When a file is selected (imageHandler function), setImage(file) updates image to the selected file object.
                  The <img> element conditionally renders only when image is truthy (i.e., a file is selected), displaying a preview using URL.createObjectURL(image)
            */}
        </div>

        {/*
            When the image is clicked, the label's htmlFor attribute directs the click to the hidden file input element,
            which then triggers the file selection dialog. Once a file is selected, the onChange event handler on the input
            element is called.
        */}

        <button onClick={()=>{AddProduct()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct