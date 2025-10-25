const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }, // không required
}, { collection: 'products' });

// Fix OverwriteModelError
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
