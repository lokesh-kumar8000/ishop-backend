const mongoose = require("mongoose");
const { Schema } = mongoose;
//  Define a Schema  for product details
const productDetailsSchema = new mongoose.Schema(
  {
    product_Id: { type: Schema.Types.ObjectId, ref: "product", required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

// Define a Schema for shipping details

const shippingDetailsSchema = new mongoose.Schema(
  {
    name: { type: String },
    contact: { type: String, require: true },
    addressLine1: { type: String, require: true },
    addressLine2: { type: String },
    city: { type: String, require: true },
    state: { type: String, require: true },
    postalCode: { type: String, require: true },
    country: { type: String, require: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    product_details: { type: [productDetailsSchema], required: true },
    order_total: { type: Number, required: true },
    payment_mode: { type: Number, required: true },
    rozorpay_order_id: { type: String, default: null },
    rozorpay_payment_id: { type: String, default: null },
    order_status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7],
      default: 0,
    },
    shipping_details: { type: shippingDetailsSchema, required: true },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
