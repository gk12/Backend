# Image Processing API with Asynchronous Workers

This project provides an API for **uploading CSV files**, processing images asynchronously, and storing compressed images locally. The system includes:

- **Multer** for file uploads
- **Sharp** for image compression
- **MongoDB** for storing processing status
- **Webhook** notifications upon completion

---

## Visual diagram of the system (Draw.io)

```sh
https://drive.google.com/file/d/1hL4E_YCthA654mWOGwmMq3SKqnmK16yF/view?usp=sharing

```

---

## 🚀 Deployment(on render)

```sh
https://backend-qdma.onrender.com/api-docs
```

---

## 🚀 Features

✅ Upload CSV files containing image URLs  
✅ Download, compress, and store images locally  
✅ Asynchronous processing using workers  
✅ Track processing status in real-time  
✅ Webhook notifications after completion

---

## 📂 Project Structure

```
/image-processing-api
│── /uploads
│   ├── /inputCsvFiles       # Stores uploaded CSV files
│   ├── /inputImages        # Stores downloaded images from URLs
│   ├── /outputImage          # Stores compressed images
│   ├── /outputCsvFiles      # Stores processed output CSV files
│── /middleware
│   ├── multerConfig.js      # Handles file uploads
│── /models
│   ├── docProcessing.model.js   # Mongoose schema for tracking status
│── /routes
│   ├── docProcessing.route.js      # API for  CSV upload and checking status

│── /controllers
│   ├── docProcessor.js    # Background worker for image processing
│   ├── generateOutputFile.js    # generate output file
│   ├── imageProcessingService.js    #  image processing
│   ├── webhookHandling.js    # handle webhook

├── worker.docs.md       # Asynchronous worker documentation
│── .env                     # Environment variables
│── index.js                # Main Express server
│── package.json             # Dependencies
│── README.md                # Project documentation
```

---

## 🛠 Installation & Setup

### 1️⃣ **Clone the repository**

```sh
git clone https://github.com/gk12/Backend.git
```

### 2️⃣ **Install dependencies**

```sh
npm install
```

### 3️⃣ **Set up environment variables**

Create a `.env` file and add:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/image-processing
WEBHOOK_URL=http://localhost:4000/webhook
```

### 5️⃣ **Run the server**

```sh
node index.js or npm start
```

✅ The server will start at **http://localhost:4040**

---

## 💽 API Endpoints

### 1️⃣ **Upload CSV File**

**`POST /uploadAndProcessDocument`**  
🔹 Upload a CSV file containing data and image URLs.

#### ✅ Request:

```
multipart/form-data
Key: file (CSV file)
```

#### ✅ Response:

```json
{
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "message": "CSV uploaded successfully, processing started."
}
```

---

### 2️⃣ **Check Processing Status**

**`GET /getProcessingStatus/:requestId`**  
🔹 Check if image processing is completed.

#### ✅ Response (Processing)

```json
{
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "processing",
  "products": []
}
```

#### ✅ Response (Completed)

```json
{
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "products": [
    {
      "serialNumber": 1,
      "productName": "SKU1",
      "inputImageUrls": ["/uploads/input_images/1700000000.jpg"],
      "outputImageUrls": ["/uploads/compressed/compressed-1700000000.jpg"]
    }
  ],
  "outputCsvPath": "/uploads/outputCsvFiles/output-123e4567-e89b-12d3-a456-426614174000.csv"
}
```
