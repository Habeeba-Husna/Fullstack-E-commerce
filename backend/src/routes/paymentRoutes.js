// // backend/src/routes/paymentRoutes.js
// import express from "express";
// import razorpayInstance from "../config/rayzorpay.js";

// const router = express.Router();

// router.post("/create-order", async (req, res) => {
//   const { amount, currency = "INR" } = req.body;
//   try {
//     const options = {
//       amount: amount * 100, // amount in smallest currency unit (paisa)
//       currency,
//       receipt: `receipt_order_${new Date().getTime()}`,
//     };

//     const order = await razorpayInstance.orders.create(options);

//     res.status(200).json({
//       success: true,
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// export default router;
