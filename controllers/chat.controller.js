const axios = require("axios");
const Chat = require("../models/chat.model");
require("dotenv").config();

const sendMessage = async (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const result = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      result.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Không có phản hồi từ Gemini.";

    // ✅ Lưu lịch sử vào MongoDB
    await Chat.create({
      prompt: message,
      response: reply,
      userId: userId || null,
    });

    res.json({ reply });
  } catch (err) {
    const geminiError =
      err.response?.data?.error?.message || err.message || "Lỗi không xác định";
    console.error("Gemini error:", geminiError);
    res.status(500).json({ error: geminiError });
  }
};

const getChatHistory = async (req, res) => {
  const { userId } = req.query;

  try {
    const chats = await Chat.find(userId ? { userId } : {}).sort({
      createdAt: -1,
    });
    res.json(chats);
  } catch (err) {
    console.error("History fetch error:", err.message);
    res.status(500).json({ error: "Failed to load history" });
  }
};

module.exports = { sendMessage, getChatHistory };
