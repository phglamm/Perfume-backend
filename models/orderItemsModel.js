const mongoose = require("mongoose");
const OrderItemSchema = new mongoose.Schema(
  {
    perfume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Perfume",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItems", OrderItemSchema);
