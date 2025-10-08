import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGODB_PRODUCT_URI)
  .then(() => console.log("✅ Product DB connected"))
  .catch(err => console.error("❌ Product DB error:", err));

// Route test
app.get("/", (req, res) => {
  res.json({ message: "Product Service Running" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Product Service running on port ${process.env.PORT}`);
});
