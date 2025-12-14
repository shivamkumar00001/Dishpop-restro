import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },

    name: { type: String, required: true },
    slug: { type: String },

    price: { type: Number, required: true },

    description: { type: String, default: "" },

    category: { type: String, default: null },

    available: { type: Boolean, default: true },

    isVeg: { type: Boolean, default: false },

    imageUrl: { type: String, default: null },
    thumbnailUrl: { type: String, default: null },

    arModelUrl: { type: String, default: null },
    iosModelUrl: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Dish", dishSchema);
