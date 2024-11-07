const port = 4000

require("dotenv").config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const multer  = require("multer")
const path = require("path")
const cors = require("cors")
const { type } = require("os")
const Razorpay = require('razorpay')

const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY)

app.use(express.json())
app.use(cors())

// apiKey = "rzp_test_AGUch6IqkJAS9r"
// apiSecret = "V8oewujpLqaA9aaShQAaT1TG"

// const razorpay = new Razorpay({
//     key_id:apiKey,
//     key_secret:apiSecret,
// })

// Database connection with MongoDB
mongoose.connect("mongodb+srv://ajaybanoth693:ovsZAY5lhjK8LvRy@cluster-ecommerce.brpwaod.mongodb.net/e-commerce")


//API Creation
app.get("/",(req,res)=>{
    res.send("Express app is running")
})

//* about multer
// When the form is submitted, the browser will encode the form data using multipart/form-data and
// include both the text input (username) and the file input (profile_picture) in the request body.
// On the server side, the web application will need to parse the multipart/form-data request to extract the individual fields and files.
// Many web frameworks provide built-in support for this. For example: Node.js: The multer middleware can be used to handle multipart/form-data.

// Image storage engine
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// creating endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        imageUrl:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//* Refer more about multer working code in Reference Directory.

// Schema for Review
const ReviewSchema = {
    reviewer:{
        type: String,
        required: true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }

}

// Schema for Creating products

const ProductSchema = {
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true, 
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
    review:[ReviewSchema]
}

const Product = mongoose.model("Produtc",ProductSchema)

// API for adding product to database.

app.post("/addproduct",async (req,res)=>{

    let products = await Product.find({})
    let id;

    if(products.length>0){
        let last_product_array = products.slice(-1)
    
        let last_product = last_product_array[0]
        id = last_product.id+1
    }
    else{
        id=1
    }

    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })

    // console.log(product)

    await product.save()

    // console.log("Saved")

    res.json({
        success:true,
        name:req.body.name,
    })
})

// API for removing products from database.

app.post("/removeproduct",async (req,res)=>{

    await Product.findOneAndDelete({id:req.body.id})

    res.json({
        success:true,
        name:req.body.name,
    })

})

// API to fetch a particular product
app.post("/fetchproduct",async (req,res)=>{

    const product_id = req.body.id

    const product = await Product.findOne({id:product_id})
    
    res.send(product)
})

app.post("/updateproduct",async (req,res)=>{

    const product_id = req.body.id

    const updatedProduct = {
        name:req.body.name,
        image:req.body.image,
        new_price:req.body.new_price
    }

    const product = await Product.findOneAndUpdate(
        {id:product_id},  //search criteria
        { $set: updatedProduct }, // update product
        // The $set operator updates the fields in the specified document with the values in updatedProduct
        {new:true} 
    )
    if (!product) {
        return res.status(404).send({ message: "Product not found" });
    }
    res.send(product)
})

// API for displaying all the products available.

app.get("/allproducts",async (req,res)=>{

    let products = await Product.find({})
  
    res.send(products)
})


// Schema for User Model

const userSchema = {
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
}

const User = mongoose.model('User',userSchema)

// Creating Endpoint for registering user

app.post("/signup",async (req,res)=>{

    let check = await User.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,errors:"Account already exists"})
    }

    let cart = {}
    for(let index=0;index<300;index++){
        cart[index]=0;
    }
    const user = new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save()

    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom')
    res.json({success:true,token})

})


// Creating Endpoint for user login

app.post("/login",async (req,res)=>{

    let user = await User.findOne({email:req.body.email})
    if(user){
        const passwCompare = req.body.password === user.password
        if(passwCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"Wrong Password"})
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

// Creating endpoint for newcollection data

app.get("/newcollection",async (req,res)=>{

    let products = await Product.find({})

    let newcollection = products.slice(1).slice(-8)

    res.send(newcollection)
})


// Creating endpoint for popular in women section

app.get("/popularinwomen",async (req,res)=>{

    let products = await Product.find({category:"women"})

    let popular_in_women = products.slice(0,4)

    res.send(popular_in_women)

})

// Creating middleware to fetch user

const fetchUser = async (req,res,next)=>{

    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try {
            
            const data = jwt.verify(token,'secret_ecom')
            req.user = data.user
            next()

        } catch (error) {
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
    }
}


// Creating endpoint for adding products in cartdata

app.post("/addtocart",fetchUser,async (req,res)=>{
    
    let userData = await User.findOne({_id:req.user.id})

    userData.cartData[req.body.itemId] += 1

    await User.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    
})

// Creating endpoint to remove product from cartdata

app.post("/removefromcart",fetchUser,async (req,res)=>{

    let userData = await User.findOne({_id:req.user.id})

    if(userData.cartData[req.body.itemId]>0){
        userData.cartData[req.body.itemId] -= 1
    }   

    await User.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData})

})

app.post("/clearcart",fetchUser,async (req,res)=>{

    try {
        
        let userData = await User.findOne({_id:req.user.id})

        for(let i in userData.cartData){
            console.log(`${i} : ${userData.cartData[i]}`)
        }

    
        for(let i in userData.cartData){
            userData.cartData[i]=0
        }

        await userData.save();

        for(let i in userData.cartData){
            console.log(`${i} : ${userData.cartData[i]}`)
        }

        res.json({ success: true, message: "Cart cleared successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Creating endpoint to get cartdata

app.post("/getcart",fetchUser,async (req,res)=>{

    let userData = await User.findOne({_id:req.user.id})
    res.send(userData.cartData)

})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on Port " + port)
    }
    else{
        console.log("Error :"+error)
    }
})

app.post("/payment",async (req,res)=>{

    try {
        // const queryString = await import('query-string')

        const items = JSON.stringify(req.body.items);
        const encodedItems = encodeURIComponent(items);

        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            line_items:req.body.items.map(item=>{
                return {
                    price_data:{
                        currency:"INR",
                        product_data:{
                            name:item.name,
                        },
                        unit_amount:(item.price)*100 
                    },
                    quantity:item.quantity
                }
            }),
            success_url:`http://localhost:3000/success?items=${encodedItems}`,
            cancel_url:"http://localhost:3000/cancel"
        }) 
        console.log("Session URL:", session.url); 
        res.json({url:session.url})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
})