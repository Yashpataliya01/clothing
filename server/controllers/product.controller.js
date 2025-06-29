import express from "express";
import Products from "../models/product.model.js";

const app = express();
app.use(express.json());

// controllers/productController.js
export const getProducts = async (req, res) => {
  const { category, size, colors, gender, tags, minPrice, maxPrice } =
    req.query;
  try {
    // Build query object
    const query = {};
    if (category) query.category = category;
    if (size) query.size = { $in: size.split(",") };
    if (colors) query["variants.color"] = { $in: colors.split(",") };
    if (gender) query["category.gender"] = gender;
    if (tags) query.tag = { $in: tags.split(",") };
    if (minPrice || maxPrice) {
      query.$or = [
        {
          discountedPrice: { $gte: minPrice || 0, $lte: maxPrice || Infinity },
        },
        {
          discountedPrice: null,
          price: { $gte: minPrice || 0, $lte: maxPrice || Infinity },
        },
      ];
    }

    const products = await Products.find(query).populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    discountedPrice,
    category,
    variants,
    size,
    tag,
  } = req.body;
  try {
    // Validate variants
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      throw new Error("At least one variant is required");
    }

    // Ensure each variant has a color and at least one image
    const processedVariants = variants.map((variant) => {
      if (
        !variant.color ||
        !Array.isArray(variant.images) ||
        variant.images.length === 0
      ) {
        throw new Error(
          "Each variant must have a color and at least one image"
        );
      }
      return {
        color: variant.color,
        images: variant.images.map((img) => ({
          url: img.url,
          publicId: img.publicId || null,
        })),
      };
    });

    const newProduct = new Products({
      name,
      description,
      price,
      discountedPrice,
      category,
      variants: processedVariants,
      size,
      tag,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    discountedPrice,
    category,
    variants,
    size,
    tag,
  } = req.body;
  try {
    const existingProduct = await Products.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate variants
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      throw new Error("At least one variant is required");
    }

    const processedVariants = variants.map((variant) => {
      if (
        !variant.color ||
        !Array.isArray(variant.images) ||
        variant.images.length === 0
      ) {
        throw new Error(
          "Each variant must have a color and at least one image"
        );
      }
      return {
        color: variant.color,
        images: variant.images.map((img) => ({
          url: img.url,
          publicId: img.publicId || null,
        })),
      };
    });

    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        discountedPrice,
        category,
        variants: processedVariants,
        size,
        tag,
      },
      { new: true, runValidators: true }
    ).populate("category");

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated Cloudinary images
    const publicIds = product.variants
      .flatMap((v) => v.images.map((img) => img.publicId))
      .filter((id) => id);
    await Promise.all(
      publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    await Products.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  const { publicId } = req.body;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: "Image deleted", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
