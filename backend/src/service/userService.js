import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import CustomError from "../utils/customError.js";
import { generateAccessToken, verifyToken } from '../utils/jwt.js';

//service of new user
export const userRegisterServices = async (data) => {
    const userExists = await User.findOne({ email: data.email });
    if (userExists) {
      throw new CustomError("User already exists", 400);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new User({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      username: data.username,
    });

    const savedUser = await newUser.save();
    return savedUser._id
};


//services of login user

export const userLoginServices=async(email,password)=>{
  const userData=await User.findOne({email})
  if(!userData){
      throw new CustomError("Invalid email or Password",401)
  }
  const isMatch=await bcrypt.compare(password,userData.password)
  if(!isMatch){
      throw new CustomError("Invalid Email or Password",401)
  }
  if(userData.isBlock){
      throw new CustomError("Your account is blocked. Please contact Admin.", 403)
  }
  return userData
}
export const refreshAccessTokenService=async(refreshToken)=>{

  //refresh token exists
  if(!refreshToken){
      throw new CustomError("Refresh token missing",401)
  }
  //verify refresh token
  const decoded=verifyToken(refreshToken,process.env.JWT_REFRESH_SECRET)
  if(!decoded){
      throw new CustomError("Invalid or expired refresh token", 403)
  }
  const user=await User.findById(decoded.id)
  if(!user){
      throw new CustomError("User not found",404)
  }
  const newAccessToken=generateAccessToken(user)
  return {newAccessToken}
}

//logout service
export const logoutUserService = () => {
  return true;
};


export const getUserDetails = async (id) => {
  const user = await User.findById(id).select('username role');
  return user;
};
