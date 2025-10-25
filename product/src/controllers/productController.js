const ProductsService = require("../services/productsService");
const productsService = new ProductsService();
const messageBroker = require("../utils/messageBroker");
const uuid = require("uuid");

/**
 * Class to hold the API implementation for the product services
 */
class ProductController {

  constructor() {
    this.createProduct = this.createProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.ordersMap = new Map();
  }

  // Create a new product
  async createProduct(req, res) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const product = await productsService.createProduct(req.body);
      return res.status(201).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Get all products
  async getProducts(req, res) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const products = await productsService.getProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Get product by ID
  async getProductById(req, res) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const product = await productsService.getProductById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Create an order
 async createOrder(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { products: productItems, user } = req.body;

    if (!productItems || productItems.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    // Lấy tất cả product từ DB để so sánh
    const allProducts = await productsService.getProducts();

    // Map thông tin chi tiết (name, price) vào order
    const orderProducts = productItems.map(item => {
      const prod = allProducts.find(p => p._id.toString() === item.productId);
      if (!prod) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      return {
        productId: prod._id,
        name: prod.name,
        price: prod.price,
        quantity: item.quantity || 1
      };
    });

    // Tính tổng tiền
    const totalPrice = orderProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Tạo order object
    const orderId = uuid.v4();
    const orderData = {
      _id: orderId,
      user,
      products: orderProducts,
      totalPrice,
      createdAt: new Date(),
      status: "completed"
    };

    // Lưu vào map hoặc DB
    this.ordersMap.set(orderId, orderData);

    // Publish message nếu cần
    await messageBroker.publishMessage("orders", orderData);

    return res.status(201).json({
      message: "Order created successfully",
      order: orderData
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
}
  // Get order status
  async getOrderStatus(req, res) {
    const { orderId } = req.params;
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  }
}

module.exports = ProductController;
