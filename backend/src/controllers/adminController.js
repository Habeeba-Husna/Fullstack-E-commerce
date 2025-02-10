import asyncHandler from "../middlewares/asyncHandler.js";
import { STATUS } from "../utils/constants.js";
import { userBlockService ,getAllUserServices,singleUserServices,getAllOrderServices,getGrossProfitServices,getTotalProductsPurchasedServices} from "../service/adminService.js";

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

//ALL USERS
export const allUser = asyncHandler(async (req, res) => {
  const { page} = req.query; 
  const pageInt = parseInt(page, 10)|| 1
  const limit=10
  const skip = (pageInt - 1) * limit;
  const { usersList, totalUsers } = await getAllUserServices(limit, skip);

  const message = usersList.length ? "User list" : "No users found";
  const totalPages = Math.ceil(totalUsers / limit);

  res.json({
    status: STATUS.SUCCESS,
    message,
    data: {
      users: usersList,
      totalUsers,
      totalPages,
      currentPage: pageInt,
    },
  });
});

//single user
export const singleUser=asyncHandler(async(req,res)=>{
  const {id}=req.params
  const user=await singleUserServices(id)
  res.json({status:STATUS.SUCCESS,message:"user details ...",user})
})

//order list
export const orderDetails=asyncHandler(async(req,res)=>{
  const orderList=await getAllOrderServices()
  res.json({status:STATUS.SUCCESS,message:"order list ...",order:orderList})
})

  //user count
  export const userCount=asyncHandler(async(req,res)=>{
    const {  totalUsers } = await getAllUserServices(10, 1);
    const message = totalUsers ? "User list" : "No users found";
    res.json({status:STATUS.SUCCESS,message:message,totalUsers})
 })

 //total revenue
export const grossProfit=asyncHandler(async(req,res)=>{
  const totalprofit=await getGrossProfitServices()
  const total=totalprofit.length>0?totalprofit[0].totalRevenue:0
  res.json({status:STATUS.SUCCESS,message:"total revenue ",total})
})

// get total products purchased
export const totalProductsPurchased = asyncHandler(async (req, res) => {
  const totalProducts = await getTotalProductsPurchasedServices();
  const total = totalProducts.length > 0 ? totalProducts[0].totalProductsPurchased : 0;
  res.json({ status: STATUS.SUCCESS, message: "Total products purchased", total });
});


