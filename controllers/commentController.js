const Perfume = require("../models/perfumeModel");
const Comment = require("../models/commentModel");

exports.postCommentRatingOnPerfume = async (req, res) => {
  try {
    const userId = req.user._id;
    const perfume = await Perfume.findById(req.params.perfumeId).populate(
      "comments"
    );
    if (!perfume) {
      return res.status(404).send("Perfume not found");
    }

    // Check if the user has already commented on this perfume
    const existingComment = perfume.comments.find((comment) =>
      comment.author.equals(userId)
    );
    if (existingComment) {
      return res.status(400).send("You have already commented on this perfume");
    }
    // Add the new comment
    const newComment = {
      rating: req.body.rating,
      content: req.body.content,
      author: userId,
    };

    // Create a new comment instance
    const comment = new Comment(newComment);
    await comment.save();

    perfume.comments.push(comment._id);
    await perfume.save();

    return res.status(201).json({
      status: 201,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    const perfume = await Perfume.findOne({ comments: commentId });
    if (!perfume) {
      return res.status(404).send("Comment not found");
    }

    // Remove the comment from the perfume
    perfume.comments = perfume.comments.filter(
      (comment) => comment.toString() !== commentId
    );
    await perfume.save();

    // Also delete the comment from the Comments collection
    await Comment.findByIdAndDelete(commentId);

    return res
      .status(200)
      .json({ status: 200, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
