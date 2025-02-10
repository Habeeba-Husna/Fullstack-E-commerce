import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import CustomError from "../utils/customError.js";

export const addOrderService = async (
  name,
  address,
  paymentMethod,
  userId
) => {

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.products.length === 0) {
    throw new CustomError(
      "Your cart is empty. Add items before placing an order."
    );
  }

  // Initialize the total to 0
  let total = 0;

  // Create order
  const order = new Order({
    user: userId,
    items: [],
    date: new Date(),
    name,
    address,
    paymentMethod,
    total,  // Set the total dynamically
  });

  for (let item of cart.products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new CustomError(`Product with ID "${item.product}" does not exist.`);
    }

    if (product.quantity < item.quantity) {
      throw new CustomError(`Insufficient quantity for ${product.name}.`);
    }

    product.quantity -= item.quantity;
    await product.save();

    // Calculate the total for this item
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    order.items.push({ productId: item.product, quantity: item.quantity });
  }

  // Now that total is calculated, save the order with the correct total
  order.total = total;
  await order.save();

  // Clear the cart
  cart.products = [];
  await cart.save();
}



export const showOrderService = async (userId, page = 1, limit = 10) => {

  if (!userId) {         // Validate inputs
    throw new CustomError("User ID is required to fetch orders.");
  }

  const skip = (page - 1) * limit;                                        // Calculate pagination parameters
  const orders = await Order.find({ user: userId })                       // Fetch orders for the user, sorted by the most recent
    .sort({ date: -1 })                                                    // Sort by descending date
    .skip(skip)
    .limit(limit)
    .populate({
      path: "items.productId",
      model: "Product",
    });

  if (!orders.length) {
    throw new CustomError("No orders found", 404);
  }

  const totalOrders = await Order.countDocuments({ user: userId });     // Get total order count for pagination

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(totalOrders / limit),
    totalOrders,
  };

  return { orders, pagination };
};