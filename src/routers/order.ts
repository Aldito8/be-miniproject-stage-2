import express from 'express';
import { handleCreateOrder, handleGetAllUserOrder, handleGetUserOrder } from '../controllers/order';
import { authenticate } from '../middlewares/auth';

const router = express.Router()

router.get('/order', authenticate, handleGetAllUserOrder)
router.get('/myorder', authenticate, handleGetUserOrder)
router.post('/order', authenticate, handleCreateOrder)

export default router