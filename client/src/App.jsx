import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navigation/Navbar";
import Home from "./pages/home/Home";
import Footer from "./components/navigation/Footer";
import Products from "./pages/products/Products";
import ProductDetailPage from "./pages/products/ProductDetails";
import Login from "./components/authentication/Login";
import MyCart from "./pages/cart/MyCart";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<MyCart />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
