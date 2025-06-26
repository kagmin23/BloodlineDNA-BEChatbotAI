const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String },
});

module.exports = mongoose.model("Chat", chatSchema);
