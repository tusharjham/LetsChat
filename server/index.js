const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const mongo = require("./config/db");
const colors = require("colors");
const { userRoutes } = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { chatRoutes } = require("./routes/chatRoutes");
const { messageRoutes } = require("./routes/messageRoutes");

const app = express();
dotenv.config();
mongo();
app.use(express.json());
app.use(userRoutes);
app.use(chatRoutes);
app.use(messageRoutes);

app.use(notFound);
app.use(errorHandler);

// app.get("/", (req, res) => {
//   res.send("API is running");
// });
// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });
// app.get("/api/chat/:id", (req, res) => {
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   res.send(singleChat);
// });

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to Socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined ", room);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("No users defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.chat._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
