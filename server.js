import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AuthRoute from "./Routes/AuthRoute.js"
dotenv.config();

const app = express();
app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: "https://prevyea-server.vercel.app/",
  credentials: true
}));
app.use(cookieParser())
app.use("/", AuthRoute)

app.listen(process.env.PORT || 8000, () => {
  console.log(`running at ${process.env.PORT}`);
});

mongoose
  .connect(process.env.URI)
  .then(() => console.log("Database Connected Succesfully"))
  .catch((err) => console.log("conn. failed ", err));

const pdfSchema = new mongoose.Schema({
  paperCode: String,
  year: Number,
  url: String,
});
const pdfModel = mongoose.model("pdfDB", pdfSchema);




// TO ADD NEW LINKS OF PYQS
app.post("/addurls", async (req, res) => {
  try {
    const { paperCode, year, url } = req.body;
    const newurl = new pdfModel({
      paperCode: paperCode,
      year: year,
      url: url,
    });
    newurl.save();
    return res.status(201).json({ msg: "added successfully" });
  } catch (error) {
    res.json({ msg: error });
  }
});

// SENDING URL IN RESPOSE
app.post("/pdf", async (req, res) => {
  try {
    const paperCode = req.body.paperCode;
    const year = req.body.year;

    const pdfExists = await pdfModel.findOne({
      paperCode: paperCode,
      year: year,
    });
    if (pdfExists) res.status(200).send(pdfExists.url);
    else res.send("1aWcJF2gtzDrhuyu5Z5CTKeZGvVOv47tz");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/aisearch", async (req, res) => {
  const search = req.body.searchquery;
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // async function
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: search,
  });
 
  return res.status(200).json({ contents: response.text });
});

// CLOUDINARY + MULTER SETUP

cloudinary.config({
  cloud_name: "dwpc2rgdn",
  api_key: "735635713731662",
  api_secret: "GCAd7eyFt787IgEywVyCHJvCDNU",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "MYPDFS",
    allowed_formats: ["pdf"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});
const upload = multer({ storage });

// UPLOAD ROUTE
app.post("/upload", upload.single("file"), (req, res) => {
    console.log(req.file)
    res.json({ url: req.file.path });
  
});

