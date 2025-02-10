import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import CustomError from "../utils/customError.js";

//user Block

  export const userBlockService = async (id) => {
    const userDetails = await User.findById(id);
    if (!userDetails) {
      throw new CustomError("user not found", 400);
    }
    userDetails.isBlock = !userDetails.isBlock;      //if user found block aanengil unblock aakkum illel vice versa
    await userDetails.save();
    return userDetails;
  };

  //get all user-non-admin users 

export const getAllUserServices = async (limit, skip) => {
  const usersList = await User
    .find({ isAdmin: { $ne: true } })
    .skip(skip)
    .limit(limit);
  const totalUsers = await User.countDocuments({ isAdmin: { $ne: true } });
  return { usersList, totalUsers };
};

//specific user
export const singleUserServices = async (id) => {
  const users = await User.findById(id);
  if (!users)
     throw CustomError("user not found", 400);
  else
    return users;
};

//order list
export const getAllOrderServices = async (id) => {
  const orderdata = await Order.find();
  return orderdata
};

//get total revenue
export const getGrossProfitServices = async () => {
  const result = await Order.aggregate([{$group:{_id:null,totalRevenue:{$sum:"$total"}}}])
  return result;
};

// get total products purchased

export const getTotalProductsPurchasedServices = async () => {
  const result = await Order.aggregate([
    { $unwind: "$items" },                                          //Unwind the products array to count each product separately
    { $group: { _id: null, totalProductsPurchased: { $sum: "$items.quantity" } } }
  ]);
  return result;
  // return result.length > 0 ? result : [{ totalProductsPurchased: 0 }];
};


