const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const URL = process.env.MONGOURL;
const databaseConnection = async (next) => {
  const dbConn = await mongoose.connect(URL);
  console.log("database connected successfully");
  next(dbConn);
};

module.exports = databaseConnection;
