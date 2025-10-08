const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/userRepository");

class AuthController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(req, res) {
    try {
      const { username, password } = req.body;
      const existingUser = await this.userRepository.getUserByUsername(username);
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userRepository.createUser({ username, password: hashedPassword });

      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await this.userRepository.getUserByUsername(username);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  }
}

module.exports = AuthController;
