import express from "express";
import { addToWishlist,getAllWishlist } from "../controllers/wishlistController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/addWishlist/:productId',authenticate,addToWishlist)
router.get('/getWishlist',authenticate,getAllWishlist)

export default router;
