const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const orderRoutes = require("./routes/order");
const config = require("./config");
const Order = require("./models/order");
require("./models/product");

class App {
  constructor() {
    this.app = express();
    this.app.use(express.json());

    this.app.use("/api/orders", orderRoutes);

    this.connectDB();
    this.setupOrderConsumer();
  }

  async connectDB() {
    try {
      await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
    }
  }

  async setupOrderConsumer(retries = 10, delay = 5000) {
    for (let i = 0; i < retries; i++) {
      try {
        const connection = await amqp.connect(config.rabbitMQURI);
        console.log("Connected to RabbitMQ");

        const channel = await connection.createChannel();
        await channel.assertQueue(config.rabbitMQQueue);

        channel.consume(config.rabbitMQQueue, async (msg) => {
          try {
            const { products, username, orderId } = JSON.parse(msg.content);

            if (!products || !products.length) {
              console.error("Message has empty products array:", msg.content.toString());
              return channel.ack(msg);
            }

            products.forEach(p => {
              if (!p.productId || !mongoose.Types.ObjectId.isValid(p.productId)) {
                throw new Error(`Invalid or missing productId in message: ${p.productId}`);
              }
            });

            const productsMapped = products.map(p => ({
              productId: new mongoose.Types.ObjectId(p.productId),
              quantity: p.quantity || 1
            }));

            const newOrder = new Order({
              products: productsMapped,
              user: username,
              totalPrice: products.reduce((acc, p) => acc + (p.price || 0), 0)
            });

            await newOrder.save();
            channel.ack(msg);
            console.log("Order saved to DB and ACK sent");

            const { user, products: savedProducts, totalPrice } = newOrder.toJSON();
            channel.sendToQueue(
              "products",
              Buffer.from(JSON.stringify({ orderId, user, products: savedProducts, totalPrice }))
            );
          } catch (err) {
            console.error("Failed to process RabbitMQ message:", err.message);
            channel.ack(msg);
          }
        });

        return;
      } catch (err) {
        console.error(`RabbitMQ connect failed (attempt ${i + 1}): ${err.message}`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    console.error("Failed to connect to RabbitMQ after retries");
  }

  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`Server started on port ${config.port}`)
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
