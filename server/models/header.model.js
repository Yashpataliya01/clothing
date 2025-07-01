import mongoos from "mongoose";

const headerSchema = new mongoos.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  publicId: { type: String },
});

export default mongoos.model("Headers", headerSchema);
