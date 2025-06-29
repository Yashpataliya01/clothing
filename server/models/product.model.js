import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  variants: {
    type: [
      {
        color: { type: String, required: true },
        images: [
          {
            url: { type: String, required: true },
            publicId: { type: String },
          },
        ],
      },
    ],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one variant is required",
    },
  },
  size: {
    type: [String],
    required: true,
  },
  tag: {
    type: String,
    enum: ["New", "Trending", "Sale", ""],
    default: "",
  },
});

export default mongoose.model("Products", productSchema);
