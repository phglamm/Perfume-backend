const PayOS = require("@payos/node");
const payOs = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);
exports.createPaymentUrl = async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:3030`;
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: 2000,
    description: "Thanh toan don hang",
    items: [
      {
        name: "Mì tôm Hảo Hảo ly",
        quantity: 1,
        price: 2000,
      },
    ],
    returnUrl: `${YOUR_DOMAIN}/success.html`,
    cancelUrl: `${YOUR_DOMAIN}/cancel.html`,
  };
  try {
    const paymentLinkResponse = await payOs.createPaymentLink(body);
    res.status(200).json({
      paymentUrl: paymentLinkResponse.checkoutUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
