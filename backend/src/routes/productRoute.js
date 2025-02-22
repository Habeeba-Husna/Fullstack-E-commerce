import express from 'express'
import {getallProducts, singleProduct} from '../controllers/productController.js'

const router=express.Router()

router.get('/getProducts', getallProducts);
router.get('/getProducts/:id', singleProduct);

export default router;