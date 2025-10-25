const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Order = require("../models/order");
const config = require("../config");

const router = express.Router();

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const detailedProducts = await Promise.all(
          order.products.map(async (p) => {
            try {
              const response = await axios.get(`${config.productServiceURL}/api/products/${p.productId}`);
              return { ...response.data, quantity: p.quantity };
            } catch (err) {
              console.error(`Failed to fetch product ${p.productId}:`, err.message);
              return { _id: p.productId, name: "Unknown", price: 0, quantity: p.quantity };
            }
          })
        );

        return {
          _id: order._id,
          user: order.user,
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
          products: detailedProducts
        };
      })
    );

    res.json(ordersWithProducts);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { products, user, totalPrice } = req.body;

    if (!products || !products.length || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate each productId
    products.forEach(p => {
      if (!p.productId || !mongoose.Types.ObjectId.isValid(p.productId)) {
        throw new Error(`Invalid or missing productId: ${p.productId}`);
      }
    });

    const productsMapped = products.map(p => ({
      productId: new mongoose.Types.ObjectId(p.productId),
      quantity: p.quantity || 1
    }));

    const newOrder = new Order({
      products: productsMapped,
      user,
      totalPrice
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message).join("; ");
      return res.status(400).json({ message: "Validation failed: " + messages });
    }
    console.error("POST /api/orders error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
