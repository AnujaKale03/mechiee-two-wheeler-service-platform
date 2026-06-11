const Razorpay = require("razorpay");
const crypto = require("crypto");

// Mock mode when keys are not configured
const isMockMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === "rzp_test_SzPN0VEBDJeYhZ";
console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log("MOCK MODE =", isMockMode);
let razorpay;
if (!isMockMode) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create a payment order
const createOrder = async (amount, currency = "INR", receipt) => {
  if (isMockMode) {
    // Return a mock order for testing without real keys
    return {
      id: `mock_order_${Date.now()}`,
      amount: amount * 100,
      currency,
      receipt,
      status: "created",
      isMock: true,
    };
  }
  const order = await razorpay.orders.create({
    amount: amount * 100, // Razorpay expects paise
    currency,
    receipt,
  });
  return order;
};

// Verify payment signature (skip in mock mode)
const verifyPayment = (orderId, paymentId, signature) => {
  if (isMockMode) return true;
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
};

module.exports = { createOrder, verifyPayment, isMockMode };