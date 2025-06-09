import { Router } from 'express';
import { OrderController } from '../modules/order/order.controller';
import { validateRequest } from '../middlewares/validateRequest/validateRequest';
import {
  createOrderDetailSchema,
  updateOrderDetailSchema,
} from '../modules/order/order.dto';
// import { OrderController } from '../modules/orderDetail/orderDetail.controller';
// import { validateRequest } from '../middlewares/validateRequest/validateRequest';
// import {
//   createOrderDetailSchema,
//   updateOrderDetailSchema,
// } from '../modules/Order/order.dto';

const router = Router();

router.post(
  '/',
  validateRequest(createOrderDetailSchema),
  OrderController.createOrderDetail,
);

router.get('/', OrderController.getAllOrderDetails);

router.get('/byID/:id', OrderController.getOrderById);

router.put(
  '/:id',
  validateRequest(updateOrderDetailSchema),
  OrderController.updateOrderDetail,
);

router.delete('/:id', OrderController.deleteOrderDetail);

router.get('/summary-report', OrderController.summaryReport);
router.get('/top-users', OrderController.topUsers);
export default router;
