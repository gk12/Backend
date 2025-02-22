const Router = require("express");
const {
  processDocument,
  getProcessingStatus,
} = require("../controllers/docProcessing.controller");
const upload = require("../middleware/multerConfig");
const { webhookData } = require('../controllers/WebhookHandling');
const docProcessingRoute = Router();

docProcessingRoute.post(
  "/uploadAndProcessDocument",
  upload.single("file"),
  processDocument
);
docProcessingRoute.get("/getProcessingStatus/:requestId", getProcessingStatus);
docProcessingRoute.post("/webhookcall",webhookData);
module.exports = docProcessingRoute;
