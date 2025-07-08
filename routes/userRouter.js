const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authenticatedMiddleware");

userRouter.put(
  "/:userId/update",
  authenticateUser,
  userController.updateMemberProfile
);

userRouter.put(
  "/:userId/changePassword",
  authenticateUser,
  userController.changePassword
);

module.exports = userRouter;
