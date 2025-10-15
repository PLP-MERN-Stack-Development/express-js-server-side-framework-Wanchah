import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getStats
} from '../controllers/productsController.js';
import validateProduct from '../middleware/validateProduct.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/stats', getStats);
router.get('/:id', getProductById);
router.post('/', validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);

export default router;