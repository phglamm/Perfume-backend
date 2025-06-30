const express = require("express");
const authRouter = express.Router();

const authController = require("../controllers/authcontroller");

authRouter
  .post("/register", authController.register)
  .post("/login", authController.login);

module.exports = authRouter;
