const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      unique: true,
      trim: true,
      minlength: [3, "brand name must be at least 3 characters"],
      maxlength: [50, "brand name must be at least 3 characters"],
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

const brandModel = mongoose.model("brand", brandSchema);
module.exports = brandModel;
