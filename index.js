const express = require("express");
const databaseConnection = require("./src/config/dbConfig");
const docProcessingRoute = require("./src/routes/docProcessing.route");
const dotenv = require("dotenv");
const { swaggerUi, swaggerSpec } = require('./src/config/swaggerConfig');
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 4041;

app.use("/api", docProcessingRoute);
app.use("/home", (req, res) => {
  res.json({
    message: "home",
  });
});
function serverConfig() {
  app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
    console.log(
      "Swagger docs available at https://backend-qdma.onrender.com/api-docs"
    );
  });
}

databaseConnection(serverConfig);
