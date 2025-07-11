const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: Number,
      unique: true,
      sparse: true, // Allows null values and ensures uniqueness for non-null values
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "PAYOS"],
    },
    subTotal: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    profit: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItems",
        required: true,
      },
    ],
    orderStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Order", OrderSchema);
