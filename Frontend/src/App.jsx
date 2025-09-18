import { Route, Routes } from "react-router-dom";

//Pages
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import CartPage from "./Pages/CartPage";
import BooksPage from "./Pages/BookPage";
import ContactPage from "./Pages/ContactPage";

import Login from "./Components/Login";
import SignUp from "./Components/Signup";
import Checkout from "./Components/Checkout";
import ProtectedRoute from "./Pages/ProtectedRoute";
import MyOrders from "./Components/MyOrders";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/checkout" element={<ProtectedRoute>
        <Checkout/>
      </ProtectedRoute>}/>

      <Route path="/order" element={<MyOrders/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>

    </Routes>
  );
};

export default App;
