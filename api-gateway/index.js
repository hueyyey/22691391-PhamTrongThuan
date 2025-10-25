import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();

// ✅ Log ra để kiểm tra đúng ENV đang dùng
console.log("✅ AUTH_SERVICE_URL:", process.env.AUTH_SERVICE_URL);
console.log("✅ PRODUCT_SERVICE_URL:", process.env.PRODUCT_SERVICE_URL);
console.log("✅ ORDER_SERVICE_URL:", process.env.ORDER_SERVICE_URL);

// ✅ Proxy tới Auth Service
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "/api/auth" }, // giữ nguyên prefix /api/auth
  })
);

// ✅ Proxy tới Product Service
app.use(
  "/api/product",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/product": "/api/product" }, // giữ nguyên prefix /api/product
  })
);

// ✅ Proxy tới Order Service
app.use(
  "/api/order",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/order": "/api/order" }, // giữ nguyên prefix /api/order
  })
);

// ✅ Chạy Gateway
app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 API Gateway running on port ${process.env.PORT || 4000}`);
});
