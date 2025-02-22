import express from "express";
import { addOrder, showOrders,verifyPayment} from "../controllers/orderController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

// Order Routes

router.post('/addOrder',authenticate,addOrder)
router.post("/verifypayment",verifyPayment)
router.get('/showOrder', authenticate, showOrders);
// router.delete("/orders/:id", authenticate, removeOrder);

export default router;
