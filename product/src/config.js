require("dotenv").config();

module.exports = {
  port: process.env.PORT || 4002, // port container Product service
  mongoURI: process.env.MONGODB_PRODUCT_URI || "mongodb://mongo:27017/productdb", // tên service mongo trong docker-compose
  rabbitMQURI: process.env.RABBITMQ_URI || "amqp://rabbitmq:5672", // tên service rabbitmq trong docker-compose
  exchangeName: process.env.EXCHANGE_NAME || "products", // exchange name
  queueName: process.env.QUEUE_NAME || "products_queue", // queue name
};
