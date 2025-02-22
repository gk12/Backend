const mongoose = require("mongoose");
const docProcessingSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "processing", "completed"],
    default: "pending",
  },
  products: [
    {
      serialNumber: Number,
      productName: String,
      inputImageUrls: [String],
      outputImageUrls: [String],
    },
  ],
});

const docProcessingData = mongoose.model(
  "docProcessingData",
  docProcessingSchema
);
module.exports = docProcessingData;
