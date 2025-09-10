import Navbar from "../Components/Navbar"
import Books from '../Components/Books'
import Footer from "../Components/Footer"
import { useEffect } from "react";

const BookPage = () => {

  useEffect(()=>{
    window.scrollTo(0,0)
   },[]);

  return (
    <>
      <Navbar/>
      <Books/>
      <Footer/>
    </>
  )
}

export default BookPage