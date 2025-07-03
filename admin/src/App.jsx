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
import Users from "./pages/users/Users";

const App = () => {
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
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
