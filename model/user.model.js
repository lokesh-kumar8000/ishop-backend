const mongoose = require("mongoose");

const ShippingAddressSchema = new mongoose.Schema(
  {
    addressLine1: {
      type: String,
      required: true,
    }, //required field
    addressLine2: {
      type: String,
      required: false,
    }, //Optional field
    city: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postCode: {
      type: Number,
      required: true,
      default: null,
    },
  },
  {
    _id: false,
  } // disable _id for this schema
);

const userSechma = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters long"],
    },
    shipping_address: {
      type: [ShippingAddressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSechma);

module.exports = UserModel;
