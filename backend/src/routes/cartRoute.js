import express from 'express'
import {addToCart,getCart,deleteCart,updateQuantityCart} from '../controllers/cartController.js'
import authenticate from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/addToCart/:productId',authenticate,addToCart)
router.get('/getCart',authenticate,getCart)
router.delete('/deleteCart/:productId',authenticate,deleteCart)
router.patch('/updateQuantity',authenticate,updateQuantityCart)
// router.patch('/increment/:productId',authenticate,incrementProductQuantity)
// router.patch('/decrement/:productId',authenticate,decrementProductQuantity)
// router.post('/addToCart/:productId',authenticate,validateParams(cartValidationSchema),addToCart);
// router.get('/getCart',authenticate,getCart);
// router.delete('/deleteCart/:productId',authenticate,deleteCart);

// // Increment and Decrement routes
// router.put('/increment/:productId',authenticate, incrementProductQuantity); 
// router.put('/decrement/:productId',authenticate, decrementProductQuantity); 

// router.patch('/updateQuantity',authenticate,updateQuantityCart)
export default router;

