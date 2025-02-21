
import CustomError from '../utils/customError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { STATUS } from '../utils/constants.js'
import {  userRegisterServices,userLoginServices,logoutUserService,getUserDetails } from "../service/userService.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from '../models/userModel.js';
import {registerValidation,loginValidation} from '../validation/validation.js'
import isAdmin from '../middlewares/isAdmin.js';
import { refreshAccessTokenService } from '../service/userService.js';


export const registerUser = asyncHandler(async (req, res) => {
  console.log("in registartion controll.....")
  const data = req.body;
  const { error } = registerValidation.validate(data);
  if (error) throw new CustomError(error.details[0].message, 400);
  await userRegisterServices(data);

  res.status(201).json({
    status: STATUS.SUCCESS,
    message: "user registerd successfully",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginValidation.validate({ email, password });
  if (error) throw new CustomError(error.details[0].message, 400);
  const User = await userLoginServices(email, password);

  const accessToken = generateAccessToken(User);
  const refreshToken = generateRefreshToken(User);
  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      user:User,
      status: STATUS.SUCCESS,
      message: User.isAdmin
        ? "Admin Login sucessfully"
        : "User Login successfully",
    });
});

//create new accesstoken
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const { newAccessToken } = await refreshAccessTokenService(refreshToken);
  res
    .cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    })
    .status(200)
    .json({
      status: STATUS.SUCCESS,
      message: "Access token refereshed",
    });
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  await logoutUserService();

  res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: '/'
  });
  res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: '/'
  });

  res.status(200).json({ message: 'Logged out successfully' });
});


export const getLoggedInUser = asyncHandler(async(req, res) => {
  const user = await getUserDetails(req.user._id);  
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  res.status(200).json({ user });
});










// import CustomError from '../utils/customError.js';
// import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
// import { STATUS } from '../utils/constants.js'
// import { userRegisterServices, loginUserServices } from "../service/userService.js";
// import asyncHandler from "../middlewares/asyncHandler.js";
// import User from '../models/userModel.js';

// // Register User Controller

// export const registerUser = asyncHandler(async (req, res) => {
//   console.log("in side register controller")
//   const data = req.body;                //get user detail from req.body
//   const newUser=await userRegisterServices(data);     //save infrmtn using service

//   res.status(201).json({
//     status: STATUS.SUCCESS,
//     message: 'User registered successfully',
//     user: {
//       id: newUser._id,
//       username: newUser.username,
//       email: newUser.email,
//     }
//   });
// });

// //login user controller

// export const loginUser = asyncHandler(async (req, res) => {
  
//   const { email, password } = req.body;   //extract
//   console.log(email,password)
//   const user = await loginUserServices(email, password);   //check user exist  email,passwrd using service

//   if (!user) {
//     return res.status(400).json({ status: "fail", message: "Invalid credentials" });
//   }

// // if login success create tokens   
//   const accessToken = generateAccessToken(user);
//   const refreshToken = generateRefreshToken(user);

//   // Set cookies in the response  store token in cookies

//   res
//     // .cookie('accessToken', accessToken, { httpOnly: true, secure: false, maxAge: 15 * 60 * 1000, path: '/' })   //res.cookie(name, value, options(expiration, security))
//     // .cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })


//     .cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 15 * 60 * 1000 })  
//     .cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 })

//     .status(200).json({
//       status: STATUS.SUCCESS,
//       message: 'user logged in successfull',
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         isAdmin: user.isAdmin,
//       },
//       token: accessToken,
//     })
//   // console.log('Cookies:', req.cookies);
// })

// export const refreshToken = asyncHandler(async (req, res) => {
//   try {
//     const { refreshToken } = req.cookies;  // Extract refresh token from cookies

//     if (!refreshToken) {
//       throw new CustomError('Refresh token missing', 401);
//     }

//     // Verify the refresh token
//     const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
//     if (!decoded) {  // If token is invalid or expired
//       throw new CustomError('Invalid or expired refresh token. Please log in again.', 401);
//     }

//     // Find the user based on decoded token ID
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       throw new CustomError('User not found', 404);
//     }

//     // Generate new tokens
//     const newAccessToken = generateAccessToken(user);
//     const newRefreshToken = generateRefreshToken(user);

//     // Set new tokens as cookies
//     res.cookie('accessToken', newAccessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",  // Set 'secure' to true in production
//       sameSite: "Strict",  // Prevents CSRF
//       maxAge: 15 * 60 * 1000  // 15 minutes expiration
//     });

//     res.cookie('refreshToken', newRefreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days expiration
//     });

//     // Respond with a success message
//     return res.status(200).json({
//       status: "success",
//       message: 'Tokens refreshed successfully'
//     });

//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     res.status(500).json({ status: "error", message: "Internal Server Error" });
//   }
// });

// export const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find(); // Fetch all users from MongoDB
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching users", error });
//     }
// };

// export const getCurrentUser = asyncHandler(async (req, res) => {
//   if (!req.user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.status(200).json({
//     id: req.user._id,
//     username: req.user.username,
//     email: req.user.email,
//     isAdmin: req.user.isAdmin,
//   });
// });


// export const logoutUser = asyncHandler(async (req, res) => {
//   res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
//   res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });

//   res.status(200).json({ message: "Logout successful" });
// });

