import mongoose from "mongoose";
import Carts from "../models/cart.model.js";
import Products from "../models/product.model.js";

// Validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Add Item to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, size, color } = req.body;

    if (!userId || !isValidObjectId(productId) || !size || quantity < 1) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const product = await Products.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!product.size.includes(size)) {
      return res.status(400).json({ message: "Invalid size for this product" });
    }

    let cart = await Carts.findOne({ user: userId });

    if (!cart) {
      cart = new Carts({ user: userId, products: [] });
    }

    const existingIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingIndex >= 0) {
      cart.products[existingIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity, size, color });
    }

    await cart.save();
    const populatedCart = await Carts.findById(cart._id).populate(
      "products.product"
    );

    res
      .status(200)
      .json({ message: "Item added to cart", cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get User's Cart
export const getCart = async (req, res) => {
  try {
    const { id: userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID is missing" });

    const cart = await Carts.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!cart) {
      return res
        .status(200)
        .json({ message: "Cart is empty", cart: { products: [] } });
    }

    res.status(200).json({ message: "Cart retrieved", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Cart Item
export const updateCart = async (req, res) => {
  try {
    const { id: cartId } = req.params;
    const { productId, quantity, size, color } = req.body;

    if (
      !isValidObjectId(cartId) ||
      !isValidObjectId(productId) ||
      !size ||
      quantity < 1 ||
      !color
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const product = await Products.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Validate size and color against product
    if (!product.size.includes(size)) {
      return res.status(400).json({ message: "Invalid size for this product" });
    }
    if (product.color && !product.color.includes(color)) {
      return res
        .status(400)
        .json({ message: "Invalid color for this product" });
    }

    const cart = await Carts.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (index === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update only the requested fields, preserving others
    cart.products[index].quantity = quantity;
    if (size !== cart.products[index].size) cart.products[index].size = size;
    if (color !== cart.products[index].color)
      cart.products[index].color = color;

    await cart.save();
    const updatedCart = await Carts.findById(cart._id).populate(
      "products.product"
    );

    res.status(200).json({ message: "Cart item updated", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Item from Cart
export const deleteCartItem = async (req, res) => {
  try {
    const { id: cartId } = req.params;
    const { productId, size } = req.body;

    if (!isValidObjectId(cartId) || !isValidObjectId(productId) || !size) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const cart = await Carts.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (index === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.products.splice(index, 1);

    if (cart.products.length === 0) {
      await Carts.deleteOne({ _id: cart._id });
      return res
        .status(200)
        .json({ message: "Cart is now empty", cart: { products: [] } });
    }

    await cart.save();
    const updatedCart = await Carts.findById(cart._id).populate(
      "products.product"
    );

    res
      .status(200)
      .json({ message: "Item removed from cart", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
