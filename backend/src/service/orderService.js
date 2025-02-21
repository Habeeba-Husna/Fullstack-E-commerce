import Cart from '../models/cartModel.js';
import CustomError from "../utils/customError.js";
import Order from '../models/orderModel.js';
import products from "../models/productModel.js";
import razorpayInstance from '../config/rayzorpay.js'
// import Razorpay from 'razorpay';


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

// export const addOrderService = async (
//   name,
//   address,
//   paymentMethod,
//   total,
//   userId
// ) => {
//   const cart = await Cart.findOne({ user: userId });
//   if (!cart || cart.products.length === 0) {
//     throw new CustomError(
//       "Your cart is empty. Add items before placing an order."
//     );
//   }
//   const order = new Order({
//     user: userId,
//     items: [],
//     name,
//     address,
//     paymentMethod,
//     total,
//   });
//   for (let item of cart.products) {
//     const product = await products.findById(item.product);
//     if (!product) {
//       throw new CustomError("Product not found", 404);
//     }

//     if (product.quantity < item.quantity) {
//       throw new CustomError(`Insufficient quantity for ${product.name}.`);
//     }
//     product.quantity -= item.quantity;
//     await product.save();


//     // Push the product to the order's items array
//     order.items.push({ productId: item.product, quantity: item.quantity });
//   }
//   await order.save();
//   cart.products = [];
//   await cart.save();

//   // Handle Razorpay payment if selected
//   if (paymentMethod === "razorpay") {

//     const options = {
//       amount: Math.round(total * 100),
//       currency: "INR",
//       receipt: `order_receipt_${order._id}`,
//       payment_capture: 1,
//     };

//     //create order with rayzorpay
//     try {
//       const razorpayOrder = await razorpayInstance.orders.create(options);
//       order.razorpayOrderId = razorpayOrder.id;
//       await order.save();
//     } catch (error) {
//       throw new CustomError("Rayzorpay order creation failed");
//     }
//   }
//   return { order, razorpayOrderId: order.razorpayOrderId };


// };

// Function to create an order in Razorpay

// export const addOrderService = async (name, address, paymentMethod, total, userId) => {
//   const cart = await Cart.findOne({ user: userId });
//   if (!cart || cart.products.length === 0) {
//     throw new CustomError("Your cart is empty. Add items before placing an order.");
//   }

//   // Create Order in DB First
//   const order = new Order({
//     user: userId,
//     items: [],
//     name,
//     address,
//     paymentMethod,
//     total,
//   });

//   for (let item of cart.products) {
//     const product = await products.findById(item.product);
//     // const product = await Product.findOne({ _id: productId, isDelete: false });

//     if (!product) {
//       throw new CustomError("Product not found", 404);
//     }

//     if (product.quantity < item.quantity) {
//       throw new CustomError(`Insufficient quantity for ${product.name}.`);
//     }

//     product.quantity -= item.quantity;
//     await product.save();

//     order.items.push({ productId: item.product, quantity: item.quantity });
//   }

//   await order.save();
//   cart.products = [];
//   await cart.save();

//   // Handle Razorpay payment if selected
//   if (paymentMethod === "razorpay") {
//     try {
//       const options = {
//         amount: total * 100, // Convert to paise
//         currency: "INR",
//         receipt: `order_rcptid_${order._id}`,
//       };

//       // Create Razorpay Order
//       const razorpayOrder = await razorpayInstance.orders.create(options);
//       console.log("Razorpay Order Created:", razorpayOrder);

//       order.razorpayOrderId = razorpayOrder.id;
//       await order.save();
//     } catch (error) {
//       console.error("Razorpay Order Creation Error:", error);
//       await Order.findByIdAndDelete(order._id); // Rollback the order if Razorpay fails
//       throw new CustomError("Razorpay order creation failed");
//     }
//   }

//   return { order, razorpayOrderId: order.razorpayOrderId };
// };


// //verify payment

// export const verifyPaymentService = async (paymentId, razorpayOrderId) => {
//   const order = await Order.findOne({ razorpayOrderId });
//   console.log("Order found:", order);

//   if (!order ){
//     throw new CustomError("order is not found", 400);
//   }
//   try {
//     const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
//     console.log("Payment Details:", paymentDetails);

//     if (paymentDetails.status === "captured") {
//       order.razorpayPaymentStatus = "paid";
//       order.status = "placed";
//       await order.save();

//       return true;
//     } else {
//       throw new CustomError("Payment verification failed");
//     }
//   } catch (error) {
//     console.error("Error during payment verification:", error);
//     throw new CustomError("Payment verification failed", 500);
//   }
// };

// export const showOrderService = async (userId) => {
//   const orders = await Order.find({ user: userId }).populate({
//     path: "items.productId",
//     model: "product",
//   }); // Populate product details
//   return { orders };
// };


// import Order from "../models/orderModel.js";
// import Cart from "../models/cartModel.js";
// import Product from "../models/productModel.js";
// import CustomError from "../utils/customError.js";
// import razorpayInstance from "../config/rayzorpay.js";

// export const addOrderService = async (
//   name,
//   address,
//   paymentMethod,
//   userId
// ) => {

//   const cart = await Cart.findOne({ user: userId });
//   if (!cart || cart.products.length === 0) {
//     throw new CustomError(
//       "Your cart is empty. Add items before placing an order."
//     );
//   }

//   // Initialize the total to 0
//   let total = 0;

//   // Create order
//   const order = new Order({
//     user: userId,
//     items: [],
//     date: new Date(),
//     name,
//     address,
//     paymentMethod,
//     total,  // Set the total dynamically
//   });

//   for (let item of cart.products) {
//     const product = await Product.findById(item.product);
//     if (!product) {
//       throw new CustomError(`Product with ID "${item.product}" does not exist.`);
//     }

//     if (product.quantity < item.quantity) {
//       throw new CustomError(`Insufficient quantity for ${product.name}.`);
//     }

//     product.quantity -= item.quantity;
//     await product.save();

//     // Calculate the total for this item
//     const itemTotal = product.price * item.quantity;
//     total += itemTotal;

//     order.items.push({ productId: item.product, quantity: item.quantity });
//   }

//   // Now that total is calculated, save the order with the correct total
//   order.total = total;
//   await order.save();

//   // Clear the cart
//   cart.products = [];
//   await cart.save();


//  // Handle Razorpay payment if selected
//  if (paymentMethod === "razorpay") {
//   const options = {
//     amount: Math.round(total * 100),
//     currency: "INR",
//     receipt: `order_receipt_${order._id}`,
//     payment_capture: 1,
//   };

//   //create order with rayzorpay
//   try {
//     const razorpayOrder = await razorpayInstance.orders.create(options);
//     order.razorpayOrderId = razorpayOrder.id;
//     await order.save();
//   } catch (error) {
//     throw new CustomError("Rayzorpay order creation failed");
//   }
// }
// return { order };
// };


// //verify payment

// export const verifyPaymentService = async (paymentId, razorpayOrderId) => {
//   const order = await Order.findOne({ razorpayOrderId });
//   if (!order || order.razorpayOrderId != razorpayOrderId) {
//     throw new CustomError("order is not found", 400);
//   }
//   try {
//     const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
//     if (paymentDetails.status === "captured") {
//       order.razorpayPaymentStatus = "paid";
//       order.status = "placed";
//       await order.save();

//       return true;
//     } else {
//       throw new CustomError("Payment verification failed");
//     }
//   } catch (error) {
//     console.error("Error during payment verification:", error);
//     throw new CustomError("Payment verification failed", 500);
//   }
// };


// export const showOrderService = async (userId, page = 1, limit = 10) => {

//   if (!userId) {         // Validate inputs
//     throw new CustomError("User ID is required to fetch orders.");
//   }

//   const skip = (page - 1) * limit;                                        // Calculate pagination parameters
//   const orders = await Order.find({ user: userId })                       // Fetch orders for the user, sorted by the most recent
//     .sort({ date: -1 })                                                    // Sort by descending date
//     .skip(skip)
//     .limit(limit)
//     .populate({
//       path: "items.productId",
//       model: "Product",
//     });

//   if (!orders.length) {
//     throw new CustomError("No orders found", 404);
//   }

//   const totalOrders = await Order.countDocuments({ user: userId });     // Get total order count for pagination

//   const pagination = {
//     currentPage: page,
//     totalPages: Math.ceil(totalOrders / limit),
//     totalOrders,
//   };

//   return { orders, pagination };
// };