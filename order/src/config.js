require('dotenv').config();
const isDocker = process.env.IS_DOCKER === 'true';

module.exports = {
  mongoURI: process.env.MONGODB_ORDER_URI || (isDocker 
    ? 'mongodb://mongo:27017/orderdb' 
    : 'mongodb://localhost:27017/orderdb'),

  rabbitMQURI: isDocker 
    ? 'amqp://rabbitmq:5672' 
    : 'amqp://localhost:5672',

  rabbitMQQueue: 'orders',

  port: process.env.PORT || 4003,

  productServiceURL: isDocker 
    ? 'http://product:4002'  
    : 'http://localhost:4002'
};
