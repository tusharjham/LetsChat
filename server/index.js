const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const mongo = require("./config/db");
const colors = require("colors");
const { userRoutes } = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { chatRoutes } = require("./routes/chatRoutes");
const { messageRoutes } = require("./routes/messageRoutes");
const path = require("path");

const app = express();
dotenv.config();
mongo();
app.use(express.json());
app.use(userRoutes);
app.use(chatRoutes);
app.use(messageRoutes);

// -------------------------deployment-----------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running goood");
  });
}
// -------------------------deployment-----------------------------
app.use(notFound);
app.use(errorHandler);

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
    console.log("user joined ", room);
    socket.join(room);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("istyping", room);
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
