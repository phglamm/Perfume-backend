const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authenticatedMiddleware");

userRouter.put(
  "/profile",
  authenticateUser,
  userController.updateMemberProfile
);

userRouter.put(
  "/:userId/changePassword",
  authenticateUser,
  userController.changePassword
);

userRouter.get("/profile", authenticateUser, userController.getMemberProfile);

module.exports = userRouter;
