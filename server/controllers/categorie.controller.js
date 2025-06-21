import express from "express";
import Categories from "../models/categorie.model.js";

const app = express();
app.use(express.json());

// get categories based on for
export const getCategories = async (req, res) => {
  try {
    const categories = await Categories.find({ gender: req.query.gender });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategories = async (req, res) => {
  const { name, image, gender } = req.body;
  try {
    const categorie = await Categories.create({ name, image, gender });
    categorie.save();
    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategories = async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;
  try {
    const categorie = await Categories.findById(id);
    categorie.name = name;
    categorie.image = image;
    categorie.save();
    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategories = async (req, res) => {
  const { id } = req.params;
  try {
    const categorie = await Categories.findByIdAndDelete(id);
    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
