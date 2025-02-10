import express from 'express'
import {addToCart,getCart,removeFromCart,incrementProductQuantity,decrementProductQuantity} from '../controllers/cartController.js'
import authenticate from '../middlewares/authMiddleware.js';
import { validate } from '../validation/validation.js';
import { cartValidationSchema } from '../validation/validation.js';

const router = express.Router();

router.post('/addToCart/:productId',authenticate,validate(cartValidationSchema),addToCart);
router.get('/getCart',authenticate,getCart);
router.delete('/removeFromCart/:productId',authenticate,removeFromCart);

// Increment and Decrement routes
router.put('/increment/:productId',authenticate, incrementProductQuantity); 
router.put('/decrement/:productId',authenticate, decrementProductQuantity); 


export default router;

