const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "category name must be at least 3 characters"],
      maxlength: [50, "category name must be at least 3 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      unique: true,
      lowercase: true, // हमेशा lowercase store होगा
      trim: true,
    },
    hexCode: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const colorModel = mongoose.model("colors", colorSchema);
module.exports = colorModel;
