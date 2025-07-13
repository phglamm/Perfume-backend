const express = require("express");
const orderRouter = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateUser } = require("../middleware/authenticatedMiddleware");

orderRouter.get("/user", authenticateUser, orderController.getOrdersForUser);

module.exports = orderRouter;
