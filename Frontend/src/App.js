import Navbar from './components/Navbar/Navbar';
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/shop';
import Footer from './components/Footer/Footer';
import men_banner from './components/assets/banner_mens.png'
import women_banner from './components/assets/banner_women.png'
import kids_banner from './components/assets/banner_kid.png'
import Address from './components/Address/Address';
import Cancel from './components/Cancel/Cancel';
import Yourorders from './components/YourOrders/Yourorders';


 
function App() { 
  return (
    <div>
      <BrowserRouter> 
          <Navbar/>
        <Routes>
          <Route path='/' element={<Shop/>}/>

          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}/>

          <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>}/>

          <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid"/>}/>

          {/* <Route path='/product' element={<Product/>}>
            <Route path=':productId' element={<Product/> }/>
          </Route> */}

          <Route path='/product/:productId' element={<Product />} />

          <Route path='/cart' element={<Cart/> }></Route>
           
           <Route path='/deliveryaddress' element={<Address/>}/>

          <Route path='/login' element={<LoginSignup/>}/>

          <Route path='/success' element={<Yourorders/>}/>

          <Route path='/cancel' element={<Cancel/>}/>
          
        </Routes>
        <Footer/> 
      </BrowserRouter> 
    </div>
  );
}

export default App;
