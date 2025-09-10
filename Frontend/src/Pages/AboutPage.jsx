import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import About from "../Components/About";
import { useEffect } from "react";

const AboutPage = () => {

 useEffect(()=>{
  window.scrollTo(0,0)
 },[]);

  return (
    <>
      <Navbar/>
      <About/>
      <Footer/>
    </>
  )
}

export default AboutPage