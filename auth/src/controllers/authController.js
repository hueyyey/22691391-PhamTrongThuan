const AuthService = require("../services/authService");

/**
 * Class to encapsulate the logic for the auth routes
 */

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    const { username, password } = req.body;

    const result = await this.authService.login(username, password);

    if (result.success) {
      res.json({ token: result.token }); // kí token và gửi về client
    } else {
      res.status(400).json({ message: result.message }); // gửi lỗi về client
    }
  }

  async register(req, res) {
    const user = req.body;
  
    try {
      const existingUser = await this.authService.findUserByUsername(user.username);
  
      if (existingUser) {
        console.log("Username already taken") // Debug log
        throw new Error("Username already taken"); // Ném lỗi nếu username đã tồn tại
      } 
  
      const result = await this.authService.register(user); // Gọi hàm register từ AuthService
      res.json(result); // Gửi phản hồi về client
    } catch (err) {
      res.status(400).json({ message: err.message }); // Gửi lỗi về client
    }
  }

  async getProfile(req, res) {
    const userId = req.user.id;

    try {
      const user = await this.authService.getUserById(userId); // Lấy thông tin user từ AuthService
      res.json(user); // Gửi thông tin user về client
    } catch (err) { // Bắt lỗi nếu có
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = AuthController;
