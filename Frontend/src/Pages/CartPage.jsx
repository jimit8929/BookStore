import Navbar from "../Components/Navbar";
import Cart from "../Components/Cart";
import { useEffect } from "react";


const CartPage = () => {

  useEffect(()=>{
    window.scrollTo(0,0)
   },[]);

  return (
    <>
      <Navbar/>
      <Cart/>
    </>
  )
}

export default CartPage