import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: "Users",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  size: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Carts", cartSchema);
