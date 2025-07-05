import express from 'express';
import { handleGetAllUser, handleGetUserProfile, handleUpdateUserPassword, handleUpdateUserProfilePic } from '../controllers/user';
import { authenticate } from '../middlewares/auth';
import { upload } from '../utils/multer';

const router = express.Router()

router.get('/user', handleGetAllUser)
router.get('/profile', authenticate, handleGetUserProfile)
router.patch('/user/update-password', authenticate, handleUpdateUserPassword)
router.patch('/user/profile-picture', authenticate, upload.single('avatar'), handleUpdateUserProfilePic)

export default router