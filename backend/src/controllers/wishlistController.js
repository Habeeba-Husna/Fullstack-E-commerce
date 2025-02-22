import asyncHandler from '../middlewares/asyncHandler.js';
import { STATUS } from '../utils/constants.js';
import {addWishlistService,getWishlistServices}from '../service/wishlistService.js'

//add favourite
export const addToWishlist=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const {productId}=req.params
    const wishlistProduct=await addWishlistService(userId,productId)
    console.log(wishlistProduct,"wish list product")
    // const existWishlist=wishlistProduct.includes(productId)
    // const msg=existWishlist===undefined?"add to favourite":"remove from favourite"
    res.status(200).json({status:STATUS.SUCCESS,message:"Favourite updated successfully",favourites:wishlistProduct})  
})

//get all favourite
export const getAllWishlist=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const userWishlist=await getWishlistServices(userId)
    if(!userWishlist || userWishlist.wishlist.length===0){
        res.status(200).json({status:STATUS.SUCCESS,message:'empty'})
    }
    else{
        res.status(200).json({status:STATUS.SUCCESS,wishlist:userWishlist.wishlist})
    }
})

