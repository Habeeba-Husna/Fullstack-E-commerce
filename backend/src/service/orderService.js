import Cart from '../models/cartModel.js';
import CustomError from "../utils/customError.js";
import Order from '../models/orderModel.js';
import products from "../models/productModel.js";
import razorpayInstance from '../config/rayzorpay.js'

export const addOrderService = async (
  name,
  address,
  paymentMethod,
  total,
  userId
) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.products.length === 0) {
    throw new CustomError(
      "Your cart is empty. Add items before placing an order."
    );
  }
  const order = new Order({
    user: userId,
    items: [],
    name,
    address,
    paymentMethod,
    total,
  });
  for (let item of cart.products) {
    const product = await products.findById(item.product);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    if (product.quantity < item.quantity) {
      throw new CustomError(`Insufficient quantity for ${product.name}.`);
    }
    product.quantity -= item.quantity;
    await product.save();
    order.items.push({ productId: item.product, quantity: item.quantity });
  }
  await order.save();
  cart.products = [];
  await cart.save();

  // Handle Razorpay payment if selected

  if (paymentMethod === "razorpay") {
    const options = {
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `order_receipt_${order._id}`,
      payment_capture: 1,
    };

    //create order with rayzorpay

    try {
      const razorpayOrder = await razorpayInstance.orders.create(options);
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
    } catch (error) {
      throw new CustomError("Rayzorpay order creation failed");
    }
  }
  return { order };
};

export const verifyPaymentService = async (paymentId, razorpayOrderId) => {
  const order = await Order.findOne({ razorpayOrderId });
  if (!order || order.razorpayOrderId != razorpayOrderId) {
    throw new CustomError("order is not found", 400);
  }
  try {
    const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
    if (paymentDetails.status === "captured") {
      order.razorpayPaymentStatus = "paid";
      order.status = "placed";
      await order.save();

      return true;
    } else {
      throw new CustomError("Payment verification failed");
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    throw new CustomError("Payment verification failed", 500);
  }
};

export const showOrderService = async (userId) => {
  const orders = await Order.find({ user: userId }).populate({
    path: "items.productId",
    model: "product",
  }); // Populate product details
  return { orders };
};
