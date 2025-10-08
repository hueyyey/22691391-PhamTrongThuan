import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();

app.use("/auth", createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true
}));

app.use("/product", createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true
}));

app.use("/order", createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true
}));

app.listen(process.env.PORT, () => {
  console.log(`🚀 API Gateway running on port ${process.env.PORT}`);
});
