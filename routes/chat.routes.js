const express = require("express");
const router = express.Router();
const { sendMessage, getChatHistory } = require("../controllers/chat.controller");
// Chat
router.post("/chat", sendMessage);
router.get("/history", getChatHistory);

module.exports = router;
