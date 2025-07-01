import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
    required: true,
  },
});

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
