const { sendStatusWebhook } = require("./WebhookHandling");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const sharp = require("sharp");

const BASE_UPLOADS_DIR = path.join(__dirname, "../uploads");
const INPUT_IMAGES_DIR = path.join(BASE_UPLOADS_DIR, "inputImages");
const COMPRESSED_DIR = path.join(BASE_UPLOADS_DIR, "outputImages");

[INPUT_IMAGES_DIR, COMPRESSED_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const compressAndStoreStoreImage = async (request) => {
  console.log(`Processing request: ${request.requestId}`);

  request.status = "processing";
  await request.save();
  for (let product of request.products) {
    const inputImagePaths = [];
    const outputImagePaths = [];

    for (let url of product.inputImageUrls) {
      try {
        console.log(`Downloading image: ${url}`);
        const imageBuffer = (await axios({ url, responseType: "arraybuffer" }))
          .data;

        // Generate file names
        const fileName = `${Date.now()}.jpg`;
        const inputPath = path.join(INPUT_IMAGES_DIR, fileName);
        const outputPath = path.join(COMPRESSED_DIR, `compressed-${fileName}`);

        fs.writeFileSync(inputPath, imageBuffer);
        inputImagePaths.push(inputPath);

        await delay(3000);

        await sharp(inputPath).jpeg({ quality: 50 }).toFile(outputPath);
        outputImagePaths.push(outputPath);
      } catch (error) {
        console.error(`Error processing image ${url}:`, error.message);
      }
    }

    product.inputImageUrls = inputImagePaths;
    product.outputImageUrls = outputImagePaths;
  }

  request.status = "completed";
  await request.save();
  await sendStatusWebhook(request.requestId);
};

module.exports = compressAndStoreStoreImage;
