import asyncHandler from "../middlewares/asyncHandler.js";
import { STATUS } from "../utils/constants.js";
import { getAllUserService,singleUserService,userBlockService,totalRevenueService,showOrderServices} from "../service/adminService.js";

//ALL USERS
export const allUsers = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const pageInt = parseInt(page, 10) || 1;
  const limit = 10;
  const skip = (pageInt - 1) * limit;
  const { usersList, totalUsers } = await getAllUserService(limit, skip);
  const message = usersList.length ? "User list" : "No users found";
  const totalPages = Math.ceil(totalUsers / limit);
  res.json({
    status: STATUS.SUCCESS,
    message,
    data: { users: usersList, totalUsers, totalPages, currentPage: pageInt },
  });
});

//single user
export const singleUser=asyncHandler(async(req,res)=>{
  const { id } = req.params;
  const user = await singleUserService(id);
  res.json({ status: STATUS.SUCCESS, message: "user details...", user });
});

//user blocking

export const userBlock=asyncHandler(async(req,res)=>{
  const {id}=req.params
  const user=await userBlockService(id)
  const message = user.isBlock? "User is blocked": "User is unblocked";
  res.json({
      status: STATUS.SUCCESS,
      message
    });
})

 //total revenue
export const totalRevenue=asyncHandler(async(req,res)=>{
  const totalProfit=await totalRevenueService()
  const total = totalProfit.length > 0 ? totalProfit[0].totalRevenue : 0;
  res.json({ status: STATUS.SUCCESS, message: "total Revenue", total });
});


//single user order
export const getUserOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page } = req.query; 
  const { orders,
      pagination} = await showOrderServices(
        id,
    parseInt(page, 10) || 1, 
    10 
  );
  const message = orders.length 
  ? "Orders retrieved successfully" 
  : "No orders found";
  res.status(200).json({
    status: STATUS.SUCCESS,
    message,
    orders,
    pagination

  });
});

