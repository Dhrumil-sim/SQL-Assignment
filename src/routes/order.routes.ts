import { Router } from 'express';
import { OrderController } from '../modules/order/order.controller';
import { validateRequest } from '../middlewares/validateRequest/validateRequest';
import { createOrderSchema } from '../modules/order/order.dto';
// You can add validateRequest middleware for request schema validation

const router = Router();

router.post(
  '/',
  validateRequest(createOrderSchema),
  OrderController.createOrder,
);
router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

export default router;
