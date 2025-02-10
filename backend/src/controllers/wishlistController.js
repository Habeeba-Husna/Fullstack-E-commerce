import asyncHandler from "../middlewares/asyncHandler.js";
import { STATUS } from "../utils/constants.js";
import { addProductToWishlist, removeWishlistService, getAllWishlistService } from "../service/wishlistService.js";

//addWishlist

export const addToWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;        // Product ID from URL
  const userId = req.user.id;       // get User ID from authentication  middleware
  const wishlistProduct = await addProductToWishlist(id, userId);
  if (wishlistProduct)
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: "Product added to wishlist successfully"
    })
});

//removeWishlist

export const removeSingleWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const { id } = req.params
  await removeWishlistService(userId, id)
  res.json({
    status: STATUS.SUCCESS,
    message: "Product removed from favourites successfully."
  })
})

//get all wishlist

export const getAllWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const userWishlist = await getAllWishlistService(userId);
  if (!userWishlist || userWishlist.wishlist.length === 0) {
    res.status(200).json({
      status: STATUS.SUCCESS,
      message: "Wishlist is empty"
    })
  }
  else
    res.status(200).json({
      status: STATUS.SUCCESS,
      wishlist: userWishlist.wishlist
    })
})