import products from '../models/productModel.js'
import Favourite from '../models/wishlistModel.js'
import CustomError from '../utils/customError.js';

export const addWishlistService=async(userId,productId)=>{
    const existingProduct=await products.findById(productId)
   
    if(!existingProduct){
        throw new CustomError('Product is not found',404)
    } 
    let userFavourite=await Favourite.findOne({user:userId})
    if(!userFavourite){
        userFavourite=new Favourite({user:userId,wishlist:[]})
    }
  
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


