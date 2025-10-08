import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGODB_ORDER_URI)
  .then(() => console.log("✅ Order DB connected"))
  .catch(err => console.error("❌ Order DB error:", err));

// Route test
app.get("/", (req, res) => {
  res.json({ message: "Order Service Running" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Order Service running on port ${process.env.PORT}`);
});
