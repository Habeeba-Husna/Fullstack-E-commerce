import express from 'express';
import { registerUser,loginUser, refreshToken, logoutUser, getLoggedInUser} from '../controllers/userController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/refreshtoken',refreshToken)
router.post('/logout',logoutUser)
router.get('/me',authenticate,getLoggedInUser)

export default router;






