import bcrypt from "bcrypt";
import user from "../models/userModel.js";
import CustomError from "../utils/customError.js";

//service of new user

export const userRegisterServices = async (data) => {
  const userExists = await user.findOne({ email: data.email });
  if (userExists) {
    throw new CustomError("User already exists", 400);
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = new user({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    username: data.username,
  });

  const savedUser = await newUser.save();

  return savedUser._id;
};

//services of login user

export const loginUserServices = async (email, password) => {
  const userData = await user.findOne({ email });
  if (!userData) {
    throw new CustomError("Please create an account, Email is invalid", 400);
  }
  const isMatch = await bcrypt.compare(password, userData.password);
  if (!isMatch) {
    throw new CustomError("Invalid Password/Email, Try Again", 400);
  }


  if (userData.isBlock) {
    throw new CustomError("Your account is blocked. Contact support.", 403);
  }
  
  return userData;
};
