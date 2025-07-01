import Discount from "../models/discount.model.js";

// Add a new discount
export const addDiscount = async (req, res) => {
  try {
    const { price, discountPercent } = req.body;

    const newDiscount = new Discount({ price, discountPercent });
    await newDiscount.save();

    res
      .status(201)
      .json({ message: "Discount created successfully", data: newDiscount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add discount", error: error.message });
  }
};

// Get all discounts
export const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.status(200).json({ data: discounts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch discounts", error: error.message });
  }
};

// Update a discount by ID
export const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, discountPercent } = req.body;

    const updated = await Discount.findByIdAndUpdate(
      id,
      { price, discountPercent },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Discount not found" });
    }

    res
      .status(200)
      .json({ message: "Discount updated successfully", data: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update discount", error: error.message });
  }
};

// Delete a discount by ID
export const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Discount.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Discount not found" });
    }

    res
      .status(200)
      .json({ message: "Discount deleted successfully", data: deleted });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete discount", error: error.message });
  }
};
