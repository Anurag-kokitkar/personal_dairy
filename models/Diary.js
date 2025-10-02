const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String], // optional tags
  date: { type: Date, default: Date.now } // automatic date & time
});

module.exports = mongoose.model("Diary", diarySchema);
