const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

const userRoutes = express.Router();

userRoutes.route("/api/user-login").post(loginUser);
userRoutes.route("/api/user-register").post(registerUser);
userRoutes.route("/api/all-users").get(protect, allUsers);

module.exports = { userRoutes };
