import express from "express";
import Products from "../models/product.model.js";

const app = express();
app.use(express.json());

export const getProducts = async (req, res) => {
  const { category } = req.query;
  try {
    const products = await Products.find().populate("category");

    const filteredProducts = category
      ? products.filter((prod) => prod.category?._id.toString() === category)
      : products;

    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price, image, discountedPrice, category, colors } =
    req.body;
  try {
    const newProduct = new Products({
      name,
      description,
      price,
      image,
      discountedPrice,
      category,
      colors,
    });
    await newProduct.save();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
