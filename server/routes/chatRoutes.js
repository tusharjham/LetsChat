const express = require("express");
const {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controller/chatController");
const { protect } = require("../middleware/authMiddleware");

const chatRoutes = express.Router();

chatRoutes.route("/api/chat/access-chat").post(protect, accessChat);
chatRoutes.route("/api/chat/fetch-chat").get(protect, fetchChat);
chatRoutes.route("/api/chat/create-group").post(protect, createGroup);
chatRoutes.route("/api/chat/rename-group").put(protect, renameGroup);
chatRoutes.route("/api/chat/add-to-group").put(protect, addToGroup);
chatRoutes.route("/api/chat/remove-from-group").put(protect, removeFromGroup);

module.exports = { chatRoutes };
