const mongoose = require("mongoose");

const perfumeSchema = new mongoose.Schema(
  {
    perfumeName: {
      type: String,
      required: true,
    },
    uri: {
      type: String,
      require: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    concentration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    targetAudience: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Perfumes", perfumeSchema);
