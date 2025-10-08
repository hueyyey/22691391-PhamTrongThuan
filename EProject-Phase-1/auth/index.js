const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const authRoute = require("./routes/auth.js");

// Load biến môi trường
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json());

// Kiểm tra env
console.log("✅ ENV MONGODB_AUTH_URI:", process.env.MONGODB_AUTH_URI);

mongoose.connect(process.env.MONGODB_AUTH_URI)
  .then(() => console.log("✅ Auth DB connected"))
  .catch((err) => console.log("❌ MongoDB connect error:", err));

app.use("/api/auth", authRoute);

app.listen(process.env.PORT || 4001, () => {
  console.log(`🚀 Auth Service running on port ${process.env.PORT || 4001}`);
});
