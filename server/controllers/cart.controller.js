import Carts from "../models/cart.model.js"; // Adjust path to your cart schema
import Products from "../models/product.model.js"; // Adjust path to your product schema
import mongoose from "mongoose";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, size } = req.body;
    console.log("addToCart - Received data:", {
      userId,
      productId,
      quantity,
      size,
    }); // Debug

    // Validate inputs
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    if (!size) {
      return res.status(400).json({ message: "Size is required" });
    }

    // Check if product exists
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if size is valid for the product
    if (!product.size.includes(size)) {
      return res.status(400).json({ message: "Invalid size for this product" });
    }

    // Find or create cart for the user
    let cart = await Carts.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!cart) {
      cart = new Carts({
        user: userId,
        products: [],
        size,
      });
    }

    // Check if product already exists in cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingProductIndex >= 0) {
      // Update quantity if product exists
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.products.push({ product: productId, quantity, size });
    }

    await cart.save();
    const populatedCart = await Carts.findById(cart._id).populate(
      "products.product"
    );
    res
      .status(200)
      .json({ message: "Item added to cart", cart: populatedCart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  const { id: userId } = req.params;

  try {
    // Validate user ID
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    // Find cart and populate product details
    const cart = await Carts.findOne({ user: userId }).populate(
      "products.product"
    );
    console.log("getCart - Found cart:", cart); // Debug
    if (!cart) {
      return res
        .status(200)
        .json({ message: "Cart is empty", cart: { products: [] } });
    }

    res.status(200).json({ message: "Cart retrieved", cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
