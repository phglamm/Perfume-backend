const PayOS = require("@payos/node");
const Order = require("../models/orderModel");
const OrderItems = require("../models/orderItemsModel");
const Perfume = require("../models/perfumeModel");

const payOs = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

exports.createPaymentUrl = async (req, res) => {
  const YOUR_DOMAIN = `perfumeshop:/`;

  try {
    const { orderItems, address, phone, customerName, email, paymentMethod } =
      req.body;
    const userId = req.user._id; // From authenticated middleware

    // Validate order items
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!address || !phone || !customerName || !email || !paymentMethod) {
      return res.status(400).json({
        message:
          "Address, phone, customerName, email, paymentMethod are required",
      });
    }

    // Calculate totals and prepare items for PayOS
    let subTotal = 0;
    let totalProfit = 0;
    const payOSItems = [];
    const orderItemsToCreate = [];

    for (const item of orderItems) {
      // Get perfume details
      const perfume = await Perfume.findById(item.perfumeId);
      if (!perfume) {
        return res
          .status(404)
          .json({ message: `Perfume with ID ${item.perfumeId} not found` });
      }

      const itemPrice = perfume.price;
      const itemCost = perfume.cost || 0; // Default to 0 if cost is not defined
      const itemTotal = itemPrice * item.quantity;
      const itemProfit = (itemPrice - itemCost) * item.quantity;

      subTotal += itemTotal;
      totalProfit += itemProfit;

      // Prepare for PayOS
      payOSItems.push({
        name: perfume.perfumeName,
        quantity: item.quantity,
        price: itemPrice,
      });

      // Prepare for database creation
      orderItemsToCreate.push({
        perfume: item.perfumeId,
        quantity: item.quantity,
        price: itemPrice,
        totalPrice: itemTotal,
      });
    }

    const totalPrice = subTotal;

    // Generate unique order code
    const orderCode = Number(String(Date.now()).slice(-6));

    // Create order in database
    const newOrder = new Order({
      orderCode,
      paymentMethod: paymentMethod === "COD" ? "COD" : "PAYOS",
      subTotal,
      totalPrice,
      profit: totalProfit,
      user: userId,
      customerName,
      email,
      address,
      phone,
      orderItems: [], // Will be populated after creating order items
      orderStatus: "Pending",
      paymentStatus: "Pending",
    });

    const savedOrder = await newOrder.save();

    // Create order items and link them to the order
    const createdOrderItems = [];
    for (const itemData of orderItemsToCreate) {
      const orderItem = new OrderItems({
        ...itemData,
        order: savedOrder._id,
      });
      const savedOrderItem = await orderItem.save();
      createdOrderItems.push(savedOrderItem._id);
    }

    // Update order with order items
    savedOrder.orderItems = createdOrderItems;
    await savedOrder.save();

    if (paymentMethod === "COD") {
      return res.status(200).json({
        success: true,
        orderId: savedOrder._id,
        orderCode,
        totalAmount: totalPrice,
        message:
          "Order created successfully, payment will be collected on delivery.",
      });
    } else if (paymentMethod === "PAYOS") {
      const payOSBody = {
        orderCode,
        amount: totalPrice,
        description: `${savedOrder._id}`,
        items: payOSItems,
        returnUrl: `${YOUR_DOMAIN}/order/success`,
        cancelUrl: `${YOUR_DOMAIN}/order/failed`,
      };

      const paymentLinkResponse = await payOs.createPaymentLink(payOSBody);

      res.status(200).json({
        success: true,
        orderId: savedOrder._id,
        paymentUrl: paymentLinkResponse.checkoutUrl,
        orderCode,
        totalAmount: totalPrice,
      });
    }
    // Create PayOS payment body
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

exports.handlePaymentWebhook = async (req, res) => {
  try {
    const { orderCode, code, desc, data } = req.body;

    // Verify webhook signature if needed
    // const isValidSignature = payOs.verifyPaymentWebhookData(req.body);
    // if (!isValidSignature) {
    //   return res.status(400).json({ message: "Invalid webhook signature" });
    // }

    // Find order by orderCode
    const order = await Order.findOne({ orderCode });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update payment status based on PayOS response
    if (code === "00") {
      // Payment successful
      order.paymentStatus = "Paid";
      order.orderStatus = "Processing";
    } else {
      // Payment failed
      order.paymentStatus = "Failed";
      order.orderStatus = "Cancelled";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated",
      orderId: order._id,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process webhook",
      error: error.message,
    });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("orderItems")
      .populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order: {
        id: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment status",
      error: error.message,
    });
  }
};
