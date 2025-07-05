import express, { Request, Response } from 'express'
import { handleLogin, handleLogout, handleRegister } from '../controllers/auth'
import { upload } from '../utils/multer';
import { authenticate } from '../middlewares/auth';

const router = express.Router()

router.post('/login', handleLogin)
router.post('/register', upload.single('avatar'), handleRegister)
router.post('/logout', authenticate, handleLogout)

router.get('/test', authenticate, (req: Request, res: Response) => {
    const user = (req as any).user
    res.status(200).json({ user })
})

export default router