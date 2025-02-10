import express from "express";
import { addToWishlist,removeSingleWishlist,getAllWishlist } from "../controllers/wishlistController.js";
import authenticate from "../middlewares/authMiddleware.js";
import { validate } from "../validation/validation.js";
import { wishlistValidationSchema } from "../validation/validation.js";
const router = express.Router();

router.post("/addToWishlist/:id", authenticate,validate(wishlistValidationSchema), addToWishlist);
router.delete('/deleteWishlist/:id',authenticate,removeSingleWishlist)
router.get('/getWishlist',authenticate,getAllWishlist)

export default router;
