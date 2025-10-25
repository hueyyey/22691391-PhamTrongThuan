const express = require("express");
const ProductController = require("../controllers/productController");
const isAuthenticated = require("../utils/isAuthenticated"); // nếu có middleware auth

const router = express.Router();
const productController = new ProductController();

router.post("/", isAuthenticated, productController.createProduct);
router.get("/", isAuthenticated, productController.getProducts);
router.get("/:id", isAuthenticated, productController.getProductById);
router.post("/buy", isAuthenticated, productController.createOrder);
router.get("/order/:orderId", isAuthenticated, productController.getOrderStatus);

module.exports = router;
