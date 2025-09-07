
//Components
import Navbar from "../Components/Navbar";
import Banner from "../Components/Banner";
import OurBestSeller from "../Components/OurBestSeller";
import HomeBooks from "../Components/HomeBooks";
import HomeAbout from "../Components/HomeAbout";

const HomePage = () => {
  return (
    <>
      <Navbar/>
      <Banner/>
      <OurBestSeller/>
      <HomeBooks/>
      <HomeAbout/>
    </>
  )
}

export default HomePage