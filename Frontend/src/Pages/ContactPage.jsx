import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Contact from "../Components/Contact";
import { useEffect } from "react";

const ContactPage = () => {

  useEffect(()=>{
    window.scrollTo(0,0)
   },[]);

  return (
    <>
      <Navbar/>
      <Contact/>
      <Footer/>
    </>
  )
}

export default ContactPage