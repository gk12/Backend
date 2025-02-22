const docProcessingData = require("../models/docProcessing.model");
const axios = require("axios");
const generateOutputCsv = require("./generateOutputFile");
const dotenv = require("dotenv");
dotenv.config();
const WEBHOOK_URL = process.env.WEBHOOKURL;

const sendStatusWebhook = async (requestId) => {
  try {
    const request = await docProcessingData.findOne({ requestId });
    if (!request) return console.error(`Request ID ${requestId} not found`);

    console.log(`Sending webhook for request ID: ${requestId}`);

    const res = await axios.post(WEBHOOK_URL, {
      requestId,
      status: "completed",
      message: "Image processing completed successfully.",
      products: request.products,
    });
    console.log("Webhook sent successfully!");
  } catch (error) {
    console.error("Error sending webhook:", error.message);
  }
};

const webhookData = async (req, res) => {
  try {
    await generateOutputCsv(req.body);
    res.json({
      data: req.body,
      message: "data",
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
    console.log(error);
  }
};

module.exports = { sendStatusWebhook, webhookData };
