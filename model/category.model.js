const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [3, "category name must be at least 3 characters"],
      maxlength: [50, "category name must be at least 3 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // हमेशा lowercase store होगा
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
