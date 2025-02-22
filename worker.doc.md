# Asynchronous Workers Documentation

## **🔹 Overview**

The **Image Processing Worker** is responsible for processing uploaded images asynchronously.  
It **runs in the background** and does not block the main API request-response cycle.

## **🔹 How It Works**

1️- **User uploads a CSV file** using `POST /uploadAndProcessDocument`.  
2️-**The API returns a `requestId` immediately** and saves the request with `status: "pending"`.  
3️-**The worker function starts processing images asynchronously:**

- Downloads input images.
- Compresses images using `sharp`.
- Saves compressed images locally in `/uploads/outputImages/`.
- Updates the database with `status: "completed"`.

4️-**A webhook is triggered** to notify external services once processing is finished.  
5️-**Users can check the processing status** via `GET /getProcessingStatus/:requestId`.

---

## **🔹 Worker Function Code**

The worker runs inside `controllers/ImageProcessingServiceInteraction.js`.

```js
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
```
