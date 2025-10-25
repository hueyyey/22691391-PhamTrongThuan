const ProductsRepository = require("../repositories/productsRepository");

class ProductsService {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async createProduct(product) {
    return await this.productsRepository.create(product);
  }

  async getProductById(productId) {
    return await this.productsRepository.findById(productId);
  }

  async getProducts() {
    return await this.productsRepository.findAll();
  }
}

module.exports = ProductsService;
