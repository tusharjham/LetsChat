const asyncHandler = require("express-async-handler");
const { Chat } = require("../models/chatModel");
const { User } = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("Not added userId in params");
    res.status(404);
    return;
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.send(fullChat);
    } catch (err) {
      res.status(401);
      throw new Error(err.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.send(result);
      });
  } catch (err) {
    res.status(401);
    throw new Error(err.message);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    return res.status(401).send("Please fill all the fields");
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user);
  try {
    const createChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    const fullChat = await Chat.findOne({ _id: createChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.send(fullChat);
  } catch (err) {
    res.status(401);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  if (!req.body.chatId || !req.body.chatName) {
    return res.status(401).send("Please fill all the fields");
  }
  const { chatId, chatName } = req.body;
  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updateChat) {
    res.status(404).send("Chat Not Found");
  } else {
    res.json(updateChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  if (!req.body.chatId || !req.body.userId) {
    return res.status(401).send("Please fill all the fields");
  }
  const { chatId, userId } = req.body;
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!chat) {
    res.status(401).send("Chat not founded");
  } else {
    res.json(chat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  if (!req.body.chatId || !req.body.userId) {
    return res.status(401).send("Please fill all the fields");
  }
  const { chatId, userId } = req.body;
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!chat) {
    res.status(401).send("Chat not founded");
  } else {
    res.json(chat);
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
