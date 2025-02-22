import asyncHandler from '../middlewares/asyncHandler.js';
import { STATUS } from '../utils/constants.js';
import { addOrderService,showOrderService,verifyPaymentService} from '../service/orderService.js'
// import Order from '../models/orderModel.js';
//add order

export const addOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const { name, address, paymentMethod, total } = req.body;
  console.log(paymentMethod,total,name,address)
  const { order, razorpayId } = await addOrderService(
    name,
    address,
    paymentMethod,
    total,
    userId
  );
  res.status(200).json({
    status: STATUS.SUCCESS,
    message: "order success",
    order,
    razorpayId,
  });
});

//verifyPayment

export const verifyPayment =asyncHandler(async (req, res) => {
  const { paymentId, orderId } = req.body;
  try {
    const isPaymentVerified = await verifyPaymentService(paymentId, orderId);

    if (isPaymentVerified) {
      res.status(200).json({
        message: "Payment verified successfully",
      });
    } else {
      throw new CustomError("Payment verification failed", 400);
    }
  } catch (error) {
    console.error("Error in payment verification endpoint:", error);
    res.status(error.status || 500).json({
      message: "Something went wrong during payment verification.",
    });
  }
});

//showOrders

export const showOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orders } = await showOrderService(userId);
  const message = orders.length
    ? "orders retrived successfully"
    : "no orders found";
  res.status(200).json({ status: STATUS.SUCCESS, message, orders });
});

//removeOrder

// export const removeOrder = async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     const deletedOrder = await Order.findByIdAndDelete(orderId);

//     if (!deletedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json({ message: "Order removed successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error in removing order" });
//   }
// };
