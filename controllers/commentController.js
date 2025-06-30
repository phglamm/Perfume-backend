const Perfume = require("../models/perfumeModel");
const Comment = require("../models/commentModel");

exports.postCommentRatingOnPerfume = async (req, res) => {
  try {
    const { userId } = req.body;
    const perfume = await Perfume.findById(req.params.perfumeId);
    if (!perfume) {
      return res.status(404).send("Perfume not found");
    }

    // Check if the member has already commented on this perfume
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
    perfume.comments.push(comment);
    await perfume.save();

    return res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
