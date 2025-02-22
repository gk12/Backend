const fs = require("fs");
const path = require("path");
const docProcessingData = require("../models/docProcessing.model");
const { v4: uuidv4 } = require("uuid");
const csv = require("csv-parser");
const compressAndStoreStoreImage = require("../controllers/ImageProcessingServiceInteraction");
const COMPRESSED_DIR = path.join(__dirname, "../uploads/outputImages");
if (!fs.existsSync(COMPRESSED_DIR)) {
  fs.mkdirSync(COMPRESSED_DIR);
}

const processDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "CSV file is required" });
  const requestId = uuidv4();
  const products = [];
  let validationErrors = [];

  // Read and validate CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      if (!row["S. No"] || !row["Product Name"] || !row["Input Image Urls"]) {
        validationErrors.push(
          "Missing required columns: Serial Number, Product Name, Input Image Urls"
        );
      }

      const imageUrls = row["Input Image Urls"]
        .split(",")
        .map((url) => url.trim());

      if (!imageUrls.every((url) => url.startsWith("http"))) {
        validationErrors.push(`Invalid image URLs in row ${row["S. No"]}`);
      }

      if (validationErrors.length === 0) {
        products.push({
          serialNumber: parseInt(row["S. No"]),
          productName: row["Product Name"].trim(),
          inputImageUrls: imageUrls,
          outputImageUrls: [],
        });
      }
    })
    .on("end", async () => {
      fs.unlinkSync(req.file.path);

      if (validationErrors.length > 0) {
        return res
          .status(400)
          .json({ error: "Invalid CSV format", details: validationErrors });
      }

      const requestData = await docProcessingData.create({
        requestId,
        status: "processing",
        products,
      });

      res.json({
        requestId,
        message:
          "CSV uploaded successfully, processing started.Output CSV file name will be with RequestId",
      });

      await compressAndStoreStoreImage(requestData);
    });
};

const getProcessingStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const data = await docProcessingData.findOne({ requestId });

    if (!data) return res.status(404).json({ error: "RequestId not found" });

    res
      .status(200)
      .json({ requestId, status: data.status, products: data.products });
  } catch (error) {
    res.status(404).json({
      error: "RequestId not processed",
    });
  }
};

module.exports = { processDocument, getProcessingStatus };
