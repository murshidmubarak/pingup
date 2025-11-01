import express from "express";
const router = express.Router();
import userController from '../controllers/userController/userController.js';
import { protect } from "../middleware/authMiddleware.js";


router.post("/signup", userController.signup);
router.get('/me', protect, userController.getCurrentUser);
router.post("/complete-profile", protect, userController.completeProfile);
router.get('/fetchUserData', protect, userController.getUser);
router.post('/updateUser', protect, userController.updateUser);



export default router;
