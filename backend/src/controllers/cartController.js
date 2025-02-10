import Cart from '../models/cartModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { STATUS } from '../utils/constants.js';
import { addProductToCart ,getUserCart,removeProductFromCart} from "../service/cartService.js";
import CustomError from '../utils/customError.js';
import mongoose from 'mongoose';

export const addToCart = asyncHandler(async (req, res) => {
  const { productId} = req.params;
  const userId=req.user._id              //get uniqueID from authentication middleware. 
  await addProductToCart(productId, userId);
  res.json({ status: STATUS.SUCCESS, message:"Product added successfully to cart."});
});

//get all items in cart
export const getCart =asyncHandler(async (req, res) => {
    const userId=req.user._id
  const cart = await getUserCart(userId);

  if(!cart)
    res.status(200).json({status:STATUS.SUCCESS,message:"Your cart is empty"})
else 
    res.status(200).json({status:STATUS.SUCCESS,message:"cart list ....",cart})
})
  
// //delete item in cart
// export const removeFromCart =asyncHandler(async (req, res) => {
//     const {productId}=req.params
//   const userId = req.user._id;
//     await removeProductFromCart(userId, productId)
//     res.json({status:STATUS.SUCCESS,message:"delete cart success"})
// })
 

//delete item in cart



  export const removeFromCart = asyncHandler(async (req, res, next) => {                    //instead req,res,next=>async (userId, productId)
    const userId = req.user.id;                                                            
    const { productId } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(productId)) {                                       // Validate if productId is a valid ObjectId
        return next(new CustomError("Invalid product ID", 400));  
    }

  const cart = await Cart.findOne({ user: userId });
  
  if (!cart)
      throw new CustomError("Cart not found", 404);

  const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

  if (productIndex === -1) {
      throw new CustomError("Product not found in the cart", 404);
  }

  const currentQuantity = cart.products[productIndex].quantity;
  if (currentQuantity > 1) {
      
      cart.products[productIndex].quantity -= 1;                 // Decrement quantity if more than 1
      await cart.save(); 
  } else {
      cart.products.splice(productIndex, 1);                    // Remove product from cart if quantity is 1
      await cart.save();
  }
  res.status(200).json({ message: "Product removed successfully", cart });
});

//increment product quantity

export const incrementProductQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id; 
  await addProductToCart(productId, userId); 
  res.json({ status: STATUS.SUCCESS, message: "Product quantity incremented successfully" });
});

// Decrement product quantity 

export const decrementProductQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id; 
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }
  const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);
  if (productIndex === -1) {
    throw new CustomError("Product not found in the cart", 404);
  }
  const currentQuantity = cart.products[productIndex].quantity;

  if (currentQuantity > 1) {
    cart.products[productIndex].quantity -= 1;                                                                   
    await cart.save(); 
    res.json({ status: STATUS.SUCCESS, message: "Product quantity decremented successfully" });
  } else {
    await removeProductFromCart(userId, productId);                                                              
    res.json({ status: STATUS.SUCCESS, message: "Product removed from cart" });
  }
});
