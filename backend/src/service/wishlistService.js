import products from '../models/productModel.js'
import Favourite from '../models/wishlistModel.js'
import CustomError from '../utils/customError.js';

export const addWishlistService=async(userId,productId)=>{
    const existingProduct=await products.findById(productId)
    // console.log(productId)
    // console.log(existingProduct)
    if(!existingProduct){
        throw new CustomError('Product is not found',404)
    } 
    let userFavourite=await Favourite.findOne({user:userId})
    if(!userFavourite){
        userFavourite=new Favourite({user:userId,wishlist:[]})
    }
    // console.log(userFavourite)
    const existingFavourite = userFavourite.wishlist.some(
        (item) => item.toString() === productId
    );
    if(existingFavourite){
        await Favourite.updateOne(
            {user:userId},
            {$pull:{wishlist:productId}}
        )
    }
    else{
        userFavourite.wishlist.push(productId)
        await userFavourite.save()
       
    }
    return await Favourite.findOne({user:userId}).populate("wishlist") 
}

//get wishlist
export const getWishlistServices=async(userId)=>{
    const userFavourite=await Favourite.findOne({user:userId}).populate("wishlist")
    return userFavourite
}




// import Wishlist from "../models/wishlistModel.js";
// import Product from "../models/productModel.js";
// import CustomError from "../utils/customError.js";

// export const addProductToWishlist = async (productId, userId) => {
//   const existingProduct = await Product.findById(productId);
//   if (!existingProduct) {
//     throw new CustomError("Product is not available.", 404);
//   }

//   let userWishlist = await Wishlist.findOne({ user: userId });
//   if (!userWishlist) {
//     userWishlist = new Wishlist({ user: userId, wishlist: [] });
//   }

//   const isProductInWishlist = userWishlist.wishlist.find(
//     (item) => item.toString() === productId.toString()
//   );

//   if (isProductInWishlist) {
//     throw new CustomError("Product is already in the wishlist", 400);
//   }

//   userWishlist.wishlist.push(productId);      // Add the product to the wishlist
//   await userWishlist.save();
//   return userWishlist
// };

// export const removeWishlistService = async (userId, productId) => {
//   const updateResult = await Wishlist.updateOne(
//     { user: userId },
//     { $pull: { wishlist: productId } }
//   );
//   if (updateResult.matchedCount === 0) {
//     throw new CustomError("No Wishlists found for the user.", 404);
//   }
//   if (updateResult.modifiedCount === 0) {
//     throw new CustomError("Product not found in user's Wishlists.", 404);
//   }
// };

// export const getAllWishlistService = async (userId) => {
//   const userWishlist = await Wishlist.findOne({ user: userId }).populate('wishlist');
//   return userWishlist
// };