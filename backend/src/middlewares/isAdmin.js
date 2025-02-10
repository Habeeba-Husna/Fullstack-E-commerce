import asyncHandler from "./asyncHandler.js";
import CustomError from "../utils/customError.js";

const isAdmin = asyncHandler((req, res, next) => {
  if (!req.user || !req.user.isAdmin) {           //user is not logged in or is not an admin
    throw new CustomError("Access denied. Admin only.", 403);
  }
  next();
});

export default isAdmin;