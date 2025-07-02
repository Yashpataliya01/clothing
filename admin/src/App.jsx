import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navigation/navbar";
import Home from "./pages/home/home";
import Products from "./pages/products/products";
import Women from "./pages/women/women";
import HeaderSection from "./pages/HeaderSection/HeaderSection";
import AdminDiscounts from "./pages/discount/Discount";
import Tranding from "./pages/tranding/Tranding";

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
          <Route path="/tranding" element={<Tranding />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
