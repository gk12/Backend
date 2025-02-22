const express = require("express");
const databaseConnection = require("./src/config/dbConfig");
const docProcessingRoute = require("./src/routes/docProcessing.route");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
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
  });
}

databaseConnection(serverConfig);
