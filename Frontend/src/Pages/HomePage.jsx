//Components
import Navbar from "../Components/Navbar";
import Banner from "../Components/Banner";
import OurBestSeller from "../Components/OurBestSeller";
import HomeBooks from "../Components/HomeBooks";
import HomeAbout from "../Components/HomeAbout";
import Footer from "../Components/Footer";
import { useEffect } from "react";

const HomePage = () => {

  useEffect(()=>{
    window.scrollTo(0,0)
   },[]);

  return (
    <>
    
        <Navbar />
        <Banner />
        <OurBestSeller />
        <HomeBooks />
        <HomeAbout />
        <Footer />
    
    </>
  );
};

export default HomePage;
