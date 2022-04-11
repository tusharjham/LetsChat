const express = require("express");
const { registerUser, loginUser } = require("../controller/userController");

const userRoutes = express.Router();

userRoutes.route("/api/user-login").post(loginUser);
userRoutes.route("/api/user-register").post(registerUser);

module.exports = { userRoutes };
