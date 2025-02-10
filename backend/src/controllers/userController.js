import CustomError from '../utils/customError.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import { STATUS } from '../utils/constants.js'
import { userRegisterServices, loginUserServices } from "../service/userService.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from '../models/userModel.js';

// Register User Controller

export const registerUser = asyncHandler(async (req, res) => {
  const data = req.body;                //get user detail from req.body
  const newUser=await userRegisterServices(data);     //save infrmtn using service

  res.status(201).json({
    status: STATUS.SUCCESS,
    message: 'User registered successfully',
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    }
  });
});

//login user controller

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;   //extract
  const user = await loginUserServices(email, password);   //check user exist  email,passwrd using service

// if login success create tokens   
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Set cookies in the response  store token in cookies

  res
    // .cookie('accessToken', accessToken, { httpOnly: true, secure: false, maxAge: 15 * 60 * 1000, path: '/' })   //res.cookie(name, value, options(expiration, security))
    // .cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })


    .cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 15 * 60 * 1000 })  
    .cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 })

    .status(200).json({
      status: STATUS.SUCCESS,
      message: 'user logged in successfull',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  // console.log('Cookies:', req.cookies);
})

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {          
    throw new CustomError('Refresh token missing', 401);
  }

  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);     //Validate the refresh token using verifyToken.
  // console.log("Decoded Token:", decoded); 
  if (!decoded) {                                                                //If token is invalid or expired
    throw new CustomError('Invalid or expired refresh token', 403);
  }

  const user = await user.findById(decoded.id);                                  //issue cheyyumbol refreshTokenl store cheydha userid 
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const newAccessToken = generateAccessToken(user);                              //user found new access token generate
  res
    // .cookie('accessToken', newAccessToken, { httpOnly: true, secure: false, maxAge: 15 * 60 * 1000 })
    .cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 15 * 60 * 1000 })

    .status(200).json({
      status: STATUS.SUCCESS,
      message: 'Access token refreshed',
    });
});


