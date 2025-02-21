import express from "express";
import { addOrder, showOrders,verifyPayment} from "../controllers/orderController.js";
import authenticate from "../middlewares/authMiddleware.js";
// import razorpayInstance from "../config/rayzorpay.js";
// import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// Payment Routes
// router.post(
//     "/create-order",
//     asyncHandler(async (req, res) => {
//       const { amount, currency = "INR" } = req.body;
//       const options = {
//         amount: amount * 100, // amount in smallest currency unit (paisa)
//         currency,
//         receipt: `receipt_order_${new Date().getTime()}`,
//       };
  
//       const order = await razorpayInstance.orders.create(options);
  
//       res.status(200).json({
//         success: true,
//         orderId: order.id,
//         amount: order.amount,
//         currency: order.currency,
//       });
//     })
//   );
  
//   router.post("/verifypayment", asyncHandler(verifyPayment));
  
  // Order Routes

router.post('/addOrder',authenticate,addOrder)
router.post("/verifypayment",verifyPayment)
router.get('/showOrder', authenticate, showOrders);

export default router;
