const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: 50,
      unique: true,
    },
    slug: {
      type: String,
      maxLength: 60,
      unique: true,
    },
    shortDescription: {
      type: String,
      maxLength: 200,
    },
    longDescription: {
      type: String,
    },
    originalPrice: {
      type: Number,
      default: 200,
    },
    discountPercentage: {
      type: Number,
      default: 5,
    },
    finalPrice: {
      type: Number,
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
    },
    brandId: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
    colors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "colors",
      },
    ],
    thumbnail: {
      type: String,
      default: null,
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Boolean,
      default: true,
    },
    topSelling: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const productModal = mongoose.model("product", productSchema);

module.exports = productModal;
