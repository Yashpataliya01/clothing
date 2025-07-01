import HeaderSection from "../models/header.model.js";

export const createHeader = async (req, res) => {
  try {
    const { name, description, image, tag } = req.body;

    // Validate inputs
    if (!name || !description || !image || !tag) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new header section
    const newHeader = new HeaderSection({
      name,
      description,
      image,
      tag,
    });
    await newHeader.save();
    res
      .status(201)
      .json({ message: "Header section created successfully", newHeader });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getHeader = async (req, res) => {
  try {
    const headers = await HeaderSection.find({});
    res.status(200).json(headers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In controllers (code2)
export const updateHeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, tag, publicId } = req.body;
    const updatedHeader = await HeaderSection.findByIdAndUpdate(
      id,
      { name, description, image, tag, publicId },
      { new: true }
    );
    if (!updatedHeader) {
      return res.status(404).json({ message: "Header not found" });
    }
    res
      .status(200)
      .json({ message: "Header updated successfully", updatedHeader });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteHeader = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await HeaderSection.findByIdAndDelete(id);
    if (!header) {
      return res.status(404).json({ message: "Header not found" });
    }
    res.status(200).json({ message: "Header deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
