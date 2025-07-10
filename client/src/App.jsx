import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navigation/Navbar";
import Home from "./pages/home/Home";
import Footer from "./components/navigation/Footer";
import Products from "./pages/products/Products";
import ProductDetailPage from "./pages/products/ProductDetails";
import Login from "./components/authentication/Login";
import UserInfoModal from "./components/authentication/UserInfo";
import MyCart from "./pages/cart/MyCart";
import About from "./pages/about/About.jsx";
import Contact from "./pages/contact/Contact.jsx";
import { AppProvider } from "./context/AuthContext.jsx";

import { FaWhatsapp } from "react-icons/fa";

const App = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const alreadySubmitted = localStorage.getItem("user-info-submitted");
    console.log("Already submitted:", alreadySubmitted);
    if (alreadySubmitted) return;
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1000 * 60 * 10); // show after 10 minutes
    return () => clearTimeout(timer);
  }, []);

  // WhatsApp URL with your number and a default message (optional)
  const whatsappNumber = "9413884119";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<MyCart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        {showModal && <UserInfoModal onClose={() => setShowModal(false)} />}
        <Footer />
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={40} color="white" />
        </a>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
