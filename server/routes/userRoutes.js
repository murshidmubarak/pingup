import express from "express";
const router = express.Router();

import userController from '../controllers/userController/userController.js';
import { protect } from "../middleware/authMiddleware.js";
import postController from '../controllers/userController/postController.js';

import multer from "multer";
const upload = multer();    // for createPost images

import uploadChunks from "../utils/multerConfig.js";  // chunk upload storage

router.post("/signup", userController.signup);
router.get('/me', protect, userController.getCurrentUser);
router.post("/complete-profile", protect, userController.completeProfile);
router.get('/fetchUserData', protect, userController.getUser);
router.post('/updateUser', protect, userController.updateUser);
router.get('/search', protect, userController.searchUsers);
router.get('/getUserById/:id', protect,userController. getUserById);





// ✅ Create Post (images or small videos)
router.post('/createPost', protect, upload.array('files'), postController.createPost);
// ✅ Chunk Upload (big videos)
router.post('/upload-chunk', protect, uploadChunks.single("chunk"), postController.uploadChunk);
// ✅ Merge Chunks
router.post('/merge-chunks', protect, postController.mergeChunks);
router.get('/fetchFeed', protect, postController.fetchFeedPosts);

export default router;
