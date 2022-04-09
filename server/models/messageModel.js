const mongoose = requrie("mongoose");

const messageModel = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
    content: { type: string, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectID, ref: "Chat" },
  },
  { timestamps: true }
);

const Message = new mongoose.model(messageModel);

module.exports = { Message };
