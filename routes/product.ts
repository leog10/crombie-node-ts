import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/product';

const productRouter = express.Router();

productRouter.get('/product', getProducts);
productRouter.get('/product/:id', getProductById);
productRouter.post('/product', createProduct);
productRouter.put('/product/:id', updateProduct);
productRouter.delete('/product/:id', deleteProduct);

export default productRouter;
