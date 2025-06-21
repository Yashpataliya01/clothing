import React from "react";
import AutoScrollHeader from "./component/header/Header";
import ShopByCategory from "./component/shopBy/ShopBy";
import StatementHighlight from "./component/highlights/Highlights";
import NewArrivalsGrid from "./component/newArivals/NewArivals";

const Home = () => {
  const newArival = [
    {
      name: "Embroidered Silk Saree",
      image1: "https://m.media-amazon.com/images/I/618ELT4eCkL._SY879_.jpg",
      image2: "https://m.media-amazon.com/images/I/718C3y4k5+L._SY741_.jpg",
      price: 129.99,
      originalPrice: 179.99,
      colors: ["#000", "#c0c0c0", "#fff"],
      sizes: ["S", "M", "L"],
    },
    {
      name: "Organza Lehenga Set",
      image1: "https://m.media-amazon.com/images/I/71Yr4olSI4L._SY879_.jpg",
      image2: "https://m.media-amazon.com/images/I/81I09R6SkhL._SY741_.jpg",
      price: 199.99,
      originalPrice: 249.99,
      colors: ["#fff", "#f0e68c"],
      sizes: ["M", "L", "XL"],
    },
    {
      name: "Men's Casual Shit",
      image1: "https://m.media-amazon.com/images/I/51-pLhPHoBL.jpg",
      image2: "https://m.media-amazon.com/images/I/51RmaAfkRkL.jpg",
      price: 199.99,
      originalPrice: 249.99,
      colors: ["#fff", "#f0e68c"],
      sizes: ["M", "L", "XL"],
    },
    {
      name: "Embroidered Silk Saree",
      image1: "https://m.media-amazon.com/images/I/618ELT4eCkL._SY879_.jpg",
      image2: "https://m.media-amazon.com/images/I/718C3y4k5+L._SY741_.jpg",
      price: 129.99,
      originalPrice: 179.99,
      colors: ["#000", "#c0c0c0", "#fff"],
      sizes: ["S", "M", "L"],
    },
    {
      name: "Organza Lehenga Set",
      image1: "https://m.media-amazon.com/images/I/71Yr4olSI4L._SY879_.jpg",
      image2: "https://m.media-amazon.com/images/I/81I09R6SkhL._SY741_.jpg",
      price: 199.99,
      originalPrice: 249.99,
      colors: ["#fff", "#f0e68c"],
      sizes: ["M", "L", "XL"],
    },
    {
      name: "Men's Casual Shit",
      image1: "https://m.media-amazon.com/images/I/51-pLhPHoBL.jpg",
      image2: "https://m.media-amazon.com/images/I/51RmaAfkRkL.jpg",
      price: 199.99,
      originalPrice: 249.99,
      colors: ["#fff", "#f0e68c"],
      sizes: ["M", "L", "XL"],
    },
  ];
  return (
    <div>
      <AutoScrollHeader />
      <ShopByCategory />
      <StatementHighlight />
      <NewArrivalsGrid
        name={"New Arrivals"}
        Description={"New Drops, New You"}
        products={newArival}
      />
      <NewArrivalsGrid name={"Sarees"} Description={"Elegance in every fold"} />
      <NewArrivalsGrid
        name={"Suits"}
        Description={"Timelessly Stylish"}
        products={newArival}
      />
    </div>
  );
};

export default Home;
