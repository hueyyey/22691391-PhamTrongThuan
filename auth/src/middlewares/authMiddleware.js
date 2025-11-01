const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Middleware to verify the token
 */

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
 
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" }); // Nếu không có token thì trả về lỗi
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret); // Giải mã token
    req.user = decoded; // Gán thông tin user vào req
    next(); // Tiếp tục sang middleware hoặc route handler tiếp theo
  } catch (e) {
    res.status(400).json({ message: "Token is not valid" });
  }
};
