import express from 'express';
import { handleUserTransferPoint } from '../controllers/transfer';
import { authenticate } from '../middlewares/auth';

const router = express.Router()

router.post('/transfer', authenticate, handleUserTransferPoint)

export default router