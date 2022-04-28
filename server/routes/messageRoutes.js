const express = require("express");
const {
  sendMessage,
  getAllMessages,
} = require("../controller/messageController");
const { protect } = require("../middleware/authMiddleware");

const messageRoutes = express.Router();

messageRoutes.route("/api/send-message").post(protect, sendMessage);
messageRoutes
  .route("/api/get-all-messages/:chatId")
  .get(protect, getAllMessages);

module.exports = { messageRoutes };
