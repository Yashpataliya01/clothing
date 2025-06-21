import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navigation/navbar";
import Login from "./components/login/login";
import Home from "./pages/home/home";
import Products from "./pages/products/products";
import Women from "./pages/women/women";

const App = () => {
  const isLogin = localStorage.getItem("isLogin");
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          {!isLogin || isLogin === null ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/women" element={<Women />} />
              <Route path="/product/:id" element={<Products />} />
              <Route path="/login" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
            </>
          )}
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
