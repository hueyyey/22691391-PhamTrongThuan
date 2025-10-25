const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true } // tự động thêm createdAt & updatedAt
);

module.exports = mongoose.model("User", userSchema);
