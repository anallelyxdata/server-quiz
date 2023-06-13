const express = require('express')
const fs = require("fs");
const cors = require('cors');
const { convert } = require("convert-svg-to-png");
const QRCode = require("qrcode");
const port = process.env.PORT || 8080;
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: process.env.REMOTE_CLIENT_APP, credentials: true }));


const corsOptions = {
  origin: "https://x-data.mx/quiz/", // Replace with the actual origin of your React app
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello, Express server is running!");
});

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/save-png", (req, res) => {
  console.log("entré a save")
  const filename = req.body.filename;
  const base64Data = req.body.base64Data.replace(/^data:image\/png;base64,/, "");
  const filePath = `/quiz/dataviz/files/${filename}`;

  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error while saving PNG file:", err);
      res.status(500).send("Error saving PNG file");
    } else {
      // Generate QR code with the URL to the saved image
      const imageUrl = `http://x-data.mx/quiz/dataviz/files/${filename}`;
      console.log("PNG file saved on the server!:(");
      res.status(200).send(imageUrl);
    }
  });

  console.log("Received file:", req.body.filename);
});

app.get("/api/image-url/:filename", (req, res) => {
  const filename = req.params;
  const imageUrl = `http://x-data.mx/quiz/dataviz/files/${filename}`;
  res.status(200).send(imageUrl);
});

app.listen(5000,()=>{console.log("server started on port 5000")})