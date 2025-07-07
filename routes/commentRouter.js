const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/commentController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authenticatedMiddleware");

commentRouter.post(
  "/:memberId/update",
  authenticateUser,
  commentController.postCommentRatingOnPerfume
);

commentRouter.delete(
  "/collectors",
  authenticateUser,
  commentController.deleteCommentById
);

module.exports = memberRouter;
