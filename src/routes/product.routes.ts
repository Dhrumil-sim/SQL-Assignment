import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest/validateRequest';
import {
  createProductSchema,
  updateProductSchema,
} from '../modules/product/product.dto';
import { ProductController } from '../modules/product/product.controller';
// import { ProductController } from './product.controller';
// import { validateRequest } from '../../middlewares/validateRequest/validateRequest';
// import { createProductSchema, updateProductSchema } from './product.dto';

const router = Router();
router.post(
  '/',
  validateRequest(createProductSchema),
  ProductController.createProduct,
);
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.put(
  '/:id',
  validateRequest(updateProductSchema),
  ProductController.updateProduct,
);
router.delete('/:id', ProductController.deleteProduct);

export default router;
