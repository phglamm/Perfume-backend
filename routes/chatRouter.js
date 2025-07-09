const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAvailableModels,
} = require("../controllers/chatController");

// POST /api/chat/message - Send a message to the AI chatbot
router.post("/message", sendMessage);

// GET /api/chat/models - Get available AI models (optional, for debugging)
router.get("/models", getAvailableModels);

module.exports = router;
