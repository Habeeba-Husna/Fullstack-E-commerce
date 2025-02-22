import asyncHandler from '../middlewares/asyncHandler.js';
import { STATUS } from '../utils/constants.js';
import { AddCartServices,getCartServices,removeCartServices,updateCartService} from "../service/cartService.js";
import Cart from '../models/cartModel.js';


// add to cart
export const addToCart=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const userId=req.user._id
    const cart =await AddCartServices(productId,userId)
    res.json({status:STATUS.SUCCESS,message:'add product successfully',cart: cart.products,})
})


//get all items in cart
export const getCart=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const cart=await getCartServices(userId)
    if(cart.products.length===0){
        res.status(200).json({status:STATUS.SUCCESS,message:'your cart is empty'})
    }
    else{
        res.status(200).json({status:STATUS.SUCCESS,message:'cart list...',cart})
    }
})

//delete item in cart
export const deleteCart=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const userId=req.user._id
    await removeCartServices(productId,userId)
    res.json({status:STATUS.SUCCESS,message:'delete cart success'})
})

//update quantity
export const updateQuantityCart=asyncHandler(async(req,res)=>{
    const {productId,quantity}=req.body
    const userId=req.user._id
    const updateCart=await updateCartService(productId,quantity,userId)
    res.status(200).json({status:STATUS.SUCCESS,message:'update cart successfully',cart:updateCart.products})
})
