const express = require("express");
const paymentRouter = express.Router();
const { authenticateUser } = require("../middleware/authenticatedMiddleware");
const paymentController = require("../controllers/paymentController");

// Create payment URL for order
paymentRouter.post(
  "/create-payment",
  authenticateUser,
  paymentController.createPaymentUrl
);

// Handle PayOS webhook
paymentRouter.post("/webhook", paymentController.handlePaymentWebhook);

// Get payment status for an order
paymentRouter.get(
  "/status/:orderId",
  authenticateUser,
  paymentController.getPaymentStatus
);

module.exports = paymentRouter;
