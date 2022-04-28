const asyncHandler = require("express-async-handler");
const { Chat } = require("../models/chatModel");
const { Message } = require("../models/messageModel");
const { User } = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  if (!req.body.content || !req.body.chatId) {
    res.status(401);
    throw new Error("Invalid data passed into request");
  }
  var newMessage = {
    sender: req.user._id,
    content: req.body.content,
    chat: req.body.chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic email");
    message = await message.populate("chat");
    message = await message.populate("chat.users", "name pic email");
    // message = await User.populate(message, {
    //   path: "chat.users",
    //   select: "pic name email",
    // });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (err) {
    res.status(401);
    throw new Error(error.message);
  }
});

const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "name pic email"
    );
    //   .populate("chat", "-users");
    res.json(messages);
  } catch (err) {
    res.status(401);
    throw new Error(err.message);
  }
});

module.exports = { sendMessage, getAllMessages };
