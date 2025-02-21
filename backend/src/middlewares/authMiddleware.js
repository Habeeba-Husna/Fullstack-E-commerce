
import { verifyToken } from '../utils/jwt.js';
import CustomError from '../utils/customError.js';
import User from '../models/userModel.js';

const authenticate=async(req,res,next)=>{
    try{
        // console.log(req.cookies)
        const token=req.cookies.accessToken
        if(!token){
            throw new CustomError("Access token is missing",401)
        }
        const decoded=verifyToken(token,process.env.JWT_SECRET)
        if(!decoded){
            throw new CustomError("Invalid or expired refresh token",403)
        }
        const user=await User.findById(decoded.id)
        if(!user){
            throw new CustomError('User not found',404)
        }
        req.user=user
        next()
    }
    catch(error){
        next(error)
    }
}
export default authenticate;





// import { verifyToken } from '../utils/jwt.js';
// import CustomError from '../utils/customError.js';
// import User from '../models/userModel.js';

// const authenticate = async (req, res, next) => { 
//   try {
//     let token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1]; // Support header-based token
//     console.log('Received Token:', token);
//     if (!token) {
//       return res.status(401).json({ status: "fail", message: "Access token missing" }); //Return proper JSON error
//     }

//     // Log JWT_SECRET used for verification
//     console.log('Verification Secret (Authenticate):', process.env.JWT_SECRET);

//     const decoded = verifyToken(token, process.env.JWT_SECRET);
//     console.log('Decoded Token:', decoded);


//     if (!decoded) {
//       return res.status(403).json({ status: "fail", message: "Invalid or expired access token" });
//     }

// // // Check token expiry manually (optional)
// // if (decoded && decoded.exp < Date.now() / 1000) {
// //   return res.status(403).json({ status: "fail", message: "Expired token" });
// // }

//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(404).json({ status: "fail", message: "User not found" });
//     }

//     req.user = user; // Store full user object instead of only `decoded` token
//     next();

//   } catch (err) {
//     console.error("Authentication Error:", err.message);
//     res.status(500).json({ status: "error", message: "Internal Server Error" });
//   }
// };

// export default authenticate;
