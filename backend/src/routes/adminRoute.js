import express from 'express'
import authenticate from '../middlewares/authMiddleware.js'
import isAdmin from '../middlewares/isAdmin.js'
import { allUser, singleUser, userBlock ,orderDetails,userCount,grossProfit,totalProductsPurchased } from '../controllers/adminController.js'
import { validate } from '../validation/validation.js';
import { userValidationSchema } from '../validation/validation.js';

const router=express.Router()

router.put('/blockUser/:id',authenticate,isAdmin,validate(userValidationSchema),userBlock)
router.get('/users',authenticate,isAdmin,allUser)
router.get('/users/:id',authenticate,isAdmin,validate(userValidationSchema),singleUser)
router.get('/order',authenticate,isAdmin,orderDetails)
router.get('/usersCount',authenticate,isAdmin,userCount)
router.get('/grossProfit',authenticate,isAdmin,grossProfit)
router.get('/totalProductsPurchased',authenticate,isAdmin,totalProductsPurchased)
export default router