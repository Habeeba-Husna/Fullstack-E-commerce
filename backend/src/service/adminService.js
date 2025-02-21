import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import CustomError from "../utils/customError.js";
import isAdmin from "../middlewares/isAdmin.js";

 
//get all user-non-admin users 

export const getAllUserService = async (limits, skips) => {
  const usersList = await User.find({ isAdmin: { $ne: true } })
  .skip(skips)
  .limit(limits);
// console.log(usersList,'users')
const totalUsers = await User.countDocuments({ isAdmin: { $ne: true } });
// console.log(totalUsers,'total')
return { usersList, totalUsers };
};

//specific user
export const singleUserService = async (id) => {
  const users = await User.findById(id);
  if (!users) {
    throw new CustomError("user not found", 400);
  }
  return users;
};



//user Block

export const userBlockService = async (id) => {
  const userDetails = await User.findById(id);
  if (!userDetails) {
    throw new CustomError("user not found", 400);
  }
  userDetails.isBlock = !userDetails.isBlock;
  userDetails.save();
  return userDetails;
};
 

//get total revenue
export const totalRevenueService = async () => {
  const result = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
  ]);
  return result;
};

// get order

export const showOrderServices = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit; 
  const total = await Order.countDocuments({ user: userId });
  const orders = await Order.find({ user: userId })
    .populate({ path: 'items.productId', model: 'product' })
    .skip(skip)
    .limit(limit);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


