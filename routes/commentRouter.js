const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateUser } = require("../middleware/authenticatedMiddleware");

commentRouter.post(
  "/:perfumeId",
  authenticateUser,
  commentController.postCommentRatingOnPerfume
);

commentRouter.delete(
  "/:commentId",
  authenticateUser,
  commentController.deleteCommentById
);

module.exports = commentRouter;
