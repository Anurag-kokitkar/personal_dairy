const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB schema
const diarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
const Diary = mongoose.model("Diary", diarySchema);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/diaryApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// API routes

// Create entry
app.post("/diary", async (req, res) => {
  try {
    const { title, content } = req.body;
    const entry = new Diary({ title, content });
    await entry.save();
    res.json({ message: "Entry created!", entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all entries
app.get("/diary", async (req, res) => {
  try {
    const entries = await Diary.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update entry
app.put("/diary/:id", async (req, res) => {
  try {
    const updatedEntry = await Diary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Entry updated!", updatedEntry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete entry
app.delete("/diary/:id", async (req, res) => {
  try {
    await Diary.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search entries
app.get("/diary/search", async (req, res) => {
  try {
    const keyword = req.query.q;
    const entries = await Diary.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } }
      ]
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
