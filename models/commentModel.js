const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentSchema);
