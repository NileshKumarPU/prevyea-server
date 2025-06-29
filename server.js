import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

app.listen(process.env.PORT || 8000, () => {
  console.log(`running at ${process.env.PORT}`);
});

mongoose
  .connect(process.env.URI)
  .then(() => console.log("Database Connected Succesfully"))
  .catch((err) => console.log("conn. failed ", err));

const pdfSchema = new mongoose.Schema({
  paperCode: String,
  year:Number,
  url: String,
});
const pdfModel = mongoose.model("pdfDB", pdfSchema);

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  password: String,
});

const userModel = mongoose.model("first", userSchema);

// TO LOGIN PREVYEA ADMIN PANEL
app.post("/login", async (req, res) => {
  try {
    const useremail = req.body.email;
    const existinguser = await userModel.findOne({ email: useremail });

    if (existinguser) {
      res.status(201).send({
        token: "test456",
        existinguser,
      });
    } else return res.status(202).json({ error: "not regisytered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TO ADD NEW LINKS OF PYQS
app.post("/addurls", async (req, res) => {
  try{

    const {paperCode,year, url } = req.body;
    const newurl = new pdfModel({
      paperCode:paperCode,
      year:year,
      url: url,
    });
    newurl.save();
    return res.status(201).json({ msg: "added successfully" });
  }catch(error){res.json({msg:error})}
});



// SENDING URL IN RESPOSE
app.post("/pdf", async (req, res) => {
  try {
    const paperCode= req.body.paperCode;
    const year = req.body.year;
  
    const pdfExists = await pdfModel.findOne({ paperCode:paperCode,year:year});
    if(pdfExists) res.status(200).send(pdfExists.url)
      else res.send("1aWcJF2gtzDrhuyu5Z5CTKeZGvVOv47tz")
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
  
});

app.post("/aisearch", async(req,res) =>{

  const search= req.body.searchquery;
  const ai = new GoogleGenAI({ apiKey:process.env.GEMINI_API_KEY });
  console.log(search)
  // async function 
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents:search,
    });
    console.log(response.text);
    return res.status(200).json({contents:response.text})
 
})