import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navigation/navbar";
import Login from "./components/login/login";
import Home from "./pages/home/home";
import Products from "./pages/products/products";
import Women from "./pages/women/women";
import HeaderSection from "./pages/HeaderSection/HeaderSection";
import AdminDiscounts from "./pages/discount/Discount";

const App = () => {
  const isLogin = localStorage.getItem("isLogin");
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/women" element={<Women />} />
          <Route path="/product/:id" element={<Products />} />
          <Route path="/headers" element={<HeaderSection />} />
          <Route path="/discount" element={<AdminDiscounts />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
