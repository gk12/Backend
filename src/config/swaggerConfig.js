const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "API documentation for my Node.js and Express project",
    },
    servers: [
      {
        url: "https://backend-qdma.onrender.com",
        // url: "https://fc5a-106-221-82-77.ngrok-free.app",
      },
    ],
  },
  apis: [path.join(__dirname, "../routes", "*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
