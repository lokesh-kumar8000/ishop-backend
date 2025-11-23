const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
  },
  phone: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    required: true,
  },
});

const contactModel = mongoose.model("contact", contactSchema);

module.exports = contactModel; 
