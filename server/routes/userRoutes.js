import express from "express";
const router = express.Router();
import userController from '../controllers/userController/userController.js';

router.post("/signup", userController.signup);
router.get('/me',  userController.getCurrentUser);



export default router;
