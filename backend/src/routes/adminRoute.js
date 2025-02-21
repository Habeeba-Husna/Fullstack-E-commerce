import express from 'express'
import authenticate from '../middlewares/authMiddleware.js'
import isAdmin from '../middlewares/isAdmin.js'
import { allUsers, singleUser, userBlock,totalRevenue,getUserOrder } from '../controllers/adminController.js'
import {addProducts,deleteProduct,updateProduct, } from '../controllers/productController.js'
import { upload } from '../config/cloudinaryConfig.js'
const router=express.Router()


router.post('/addProduct',authenticate,isAdmin,upload.single('url'),addProducts);
router.delete("/deleteproduct/:productId",authenticate,isAdmin,deleteProduct);
router.patch('/blockUser/:id',authenticate,isAdmin,userBlock)

router.get('/getusers',authenticate,isAdmin,allUsers)
router.patch("/updateproduct", authenticate, isAdmin,upload.single('url'), updateProduct);
router.get('/getusers/:id',authenticate,isAdmin,singleUser)
router.get("/totalRevenue", authenticate, isAdmin, totalRevenue);
router.get("/getUserOrder/:id",authenticate,isAdmin,getUserOrder)

export default router


