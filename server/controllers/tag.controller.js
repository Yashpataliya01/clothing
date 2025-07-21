import Tags from "../models/tag.model.js"; // Adjust path based on your project structure

// Show all tags or a specific tag by ID
export const showTags = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      // Show a specific tag by ID
      const tag = await Tags.findById(id);
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      return res.status(200).json(tag);
    }

    // Show all tags
    const tags = await Tags.find().sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error in showTags:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new tag
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    // Check if tag already exists (case-insensitive)
    const existingTag = await Tags.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    // Create and save new tag
    const newTag = new Tags({ name });
    await newTag.save();

    res.status(201).json({ message: "Tag created successfully", tag: newTag });
  } catch (error) {
    console.error("Error in createTag:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Edit an existing tag
export const editTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    // Check if tag exists
    const tag = await Tags.findById(id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Check if new name already exists (case-insensitive, excluding current tag)
    const existingTag = await Tags.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      _id: { $ne: id },
    });
    if (existingTag) {
      return res.status(400).json({ message: "Tag name already in use" });
    }

    // Update tag
    tag.name = name;
    await tag.save();

    res.status(200).json({ message: "Tag updated successfully", tag });
  } catch (error) {
    console.error("Error in editTag:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
