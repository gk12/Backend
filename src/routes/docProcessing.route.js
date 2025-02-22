const Router = require("express");
const {
  processDocument,
  getProcessingStatus,
} = require("../controllers/docProcessing.controller");
const upload = require("../middleware/multerConfig");
const { webhookData } = require("../controllers/WebhookHandling");
const docProcessingRoute = Router();

/**
 * @swagger
 * /api/uploadAndProcessDocument:
 *   post:
 *     summary: Upload and process a document
 *     tags: [Document Processing]
 *     description: Upload a file and process it.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request (file not provided)
 *       500:
 *         description: Internal server error
 */

docProcessingRoute.post(
  "/uploadAndProcessDocument",
  upload.single("file"),
  processDocument
);

/**
 * @swagger
 * /api/getProcessingStatus/{requestId}:
 *   get:
 *     summary: Get document processing status
 *     description: Fetches the processing status of a document by request ID.
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique request ID for the document.
 *     responses:
 *       200:
 *         description: Successfully retrieved processing status.
 *       404:
 *         description: Request ID not found.
 */
docProcessingRoute.get("/getProcessingStatus/:requestId", getProcessingStatus);

/**
 * @swagger
 * /api/webhookcall:
 *   post:
 *     summary: Webhook callback
 *     description: Handles incoming webhook data from external sources.
 *     responses:
 *       200:
 *         description: Webhook processed successfully.
 *       400:
 *         description: Bad request, invalid data.
 */
docProcessingRoute.post("/webhookcall", webhookData);
module.exports = docProcessingRoute;
