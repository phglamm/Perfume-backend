const express = require("express");
const paymentRouter = express.Router();
const { authenticateUser } = require("../middleware/authenticatedMiddleware");
const paymentController = require("../controllers/paymentController");
paymentRouter.post(
  "/create-payment",
  authenticateUser,
  paymentController.createPaymentUrl
);
// paymentRouter.get(
//   "/payment-return",
//   authenticateUser,
//   paymentController.getPaymentReturn
// );

module.exports = paymentRouter;
