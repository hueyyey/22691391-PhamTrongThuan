const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  user: { type: String, required: false },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'orders' });

module.exports = mongoose.model("Order", orderSchema);
