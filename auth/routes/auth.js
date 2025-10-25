const express = require("express");
const AuthController = require("../src/controllers/authController");

const router = express.Router();
const authController = new AuthController();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
