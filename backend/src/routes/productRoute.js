import express from 'express'
import {getallProducts, singleProduct} from '../controllers/productController.js'
// import {getAllProducts,singleProduct,addProduct,deleteProduct,updateProduct} from '../controllers/productController.js'

// import isAdmin from '../middlewares/isAdmin.js';
// import authenticate from '../middlewares/authMiddleware.js';
// import { validateBody, productValidationSchema } from "../validation/validation.js";
// import { upload } from '../config/cloudinaryConfig.js';

const router=express.Router()

// Public Routes-No authentication required

router.get('/getProducts', getallProducts);
router.get('/getProducts/:id', singleProduct);

// Admin Routes
// router.post('/addProduct',authenticate,isAdmin,upload.single('image'),validateBody(productValidationSchema),addProduct);     //ivide upload with the field name -image/url adhavanam req kodukkendadh addproduct timel postman
// router.delete('/deleteProduct/:id',authenticate,isAdmin,deleteProduct);
// router.put('/updateProduct',authenticate,isAdmin,validateBody(productValidationSchema),updateProduct);


export default router;