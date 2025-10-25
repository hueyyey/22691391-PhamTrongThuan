const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const productRoutes = require("./src/routes/productRoutes");

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGODB_PRODUCT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Product DB connected"))
  .catch(err => console.error("❌ Product DB error:", err));

// ✅ Product routes
app.use("/api/products", productRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "Product Service Running" });
});

// ✅ Start server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
});
