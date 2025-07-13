const Order = require("../models/orderModel");

exports.getOrdersForUser = async (req, res) => {
  try {
    const userId = req.user._id; // From authenticated middleware
    const orders = await Order.find({ user: userId })
      .populate({
        path: "orderItems",
        populate: {
          path: "perfume",
          select: "perfumeName uri price concentration ",
        },
        select: "quantity totalPrice",
      })
      .populate("user", "username email fullName phone")
      .select("-__v  -updatedAt");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({
      status: 200,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
