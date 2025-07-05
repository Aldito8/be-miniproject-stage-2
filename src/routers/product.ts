import express from 'express';
import { handleCreateProduct, handleGetAllProduct, handleGetProductAdmin, handleHardDeleteProduct, handleRestoreSoftDeleteProduct, handleSoftDeleteProduct, handleUpdateProduct } from '../controllers/product';
import { authenticate } from '../middlewares/auth';
import { upload } from '../utils/multer';

const router = express.Router()

router.get('/products', handleGetAllProduct)
router.get('/myproducts', authenticate, handleGetProductAdmin)
router.post('/add', authenticate, upload.single('image'), handleCreateProduct)
router.put('/update/:id', authenticate, upload.single('image'), handleUpdateProduct)
router.patch('/delete/:id', authenticate, handleSoftDeleteProduct)
router.patch('/:id/restore', authenticate, handleRestoreSoftDeleteProduct)
router.delete('/delete/delete/:id', authenticate, handleHardDeleteProduct)

export default router