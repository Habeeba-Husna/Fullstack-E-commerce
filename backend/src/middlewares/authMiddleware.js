import { verifyToken } from '../utils/jwt.js';
import CustomError from '../utils/customError.js';
import User from '../models/userModel.js';

const authenticate = async (req, res, next) => {                    //checks user has a valid JWT
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new CustomError('Access token missing', 401);
    }

    const decoded = verifyToken(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new CustomError('Invalid or expired access token', 403);
    }

    const user = await User.findById(decoded.id);           //Look user in database using decoded.id obtained from a previously verified token jwt
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    req.user = user;         //it can be accessed in middleware/route handlers
    next();

  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default authenticate;
