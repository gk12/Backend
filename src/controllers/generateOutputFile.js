const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const BASE_UPLOADS_DIR = path.join(__dirname, "../uploads");
const OUTPUT_CSV_DIR = path.join(BASE_UPLOADS_DIR, "/outputCsvFiles");
if (!fs.existsSync(OUTPUT_CSV_DIR)) {
  fs.mkdirSync(OUTPUT_CSV_DIR);
}
async function generateOutputCsv(request) {
  try {
    const outputCsvFilePath = path.join(
      OUTPUT_CSV_DIR,
      `output-${request.requestId}.csv`
    );

    const json2csvParser = new Parser({
      fields: [
        "S. No",
        "Product Name",
        "Input Image Urls",
        "Output Image Urls",
      ],
    });

    const csvData = request.products.map((product) => ({
      "S. No": product.serialNumber,
      "Product Name": product.productName,
      "Input Image Urls": product.inputImageUrls.join(", "),
      "Output Image Urls": product.outputImageUrls.join(", "),
    }));

    const csvContent = json2csvParser.parse(csvData);

    fs.writeFileSync(outputCsvFilePath, csvContent);
    console.log(`Output CSV file saved: ${outputCsvFilePath}`);
  } catch (error) {
    console.error("Error generating CSV file:", error.message);
  }
}

module.exports = generateOutputCsv;
