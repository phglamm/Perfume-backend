const express = require("express");
const memberRouter = express.Router();
const memberController = require("../controllers/memberController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authenticatedMiddleware");

memberRouter.put(
  "/:memberId/update",
  authenticateUser,
  memberController.updateMemberProfile
);

memberRouter.get(
  "/collectors",
  authenticateUser,
  authorizeAdmin,
  memberController.getAllCollectors
);

memberRouter.put(
  "/:memberId/changePassword",
  authenticateUser,
  memberController.changePassword
);

module.exports = memberRouter;
