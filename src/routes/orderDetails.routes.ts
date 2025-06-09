import { Router } from 'express';
import { OrderController } from '../modules/order/order.controller';
import { validateRequest } from '../middlewares/validateRequest/validateRequest';
import {
  createOrderSchema,
  updateOrderSchema,
} from '../modules/order/order.dto';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Order ID
 *         userID:
 *           type: integer
 *           description: User ID who placed the order
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Order creation date
 *         expectedDeliveryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Expected delivery date
 *         orderStatus:
 *           type: string
 *           enum: [Pending, Shipped, Delivered, Cancelled]
 *           description: Current order status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         User:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *         OrderDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderDetail'
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - userID
 *         - orderStatus
 *       properties:
 *         userID:
 *           type: integer
 *           description: User ID who is placing the order
 *           example: 1
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Order date (optional, defaults to current time)
 *           example: "2025-01-15T10:30:00.000Z"
 *         expectedDeliveryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Expected delivery date
 *           example: "2025-01-20T10:30:00.000Z"
 *         orderStatus:
 *           type: string
 *           enum: [Pending, Shipped, Delivered, Cancelled]
 *           description: Order status
 *           example: "Pending"
 *     UpdateOrderRequest:
 *       type: object
 *       properties:
 *         userID:
 *           type: integer
 *           description: User ID
 *           example: 1
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Order date
 *           example: "2025-01-15T10:30:00.000Z"
 *         expectedDeliveryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Expected delivery date
 *           example: "2025-01-22T10:30:00.000Z"
 *         orderStatus:
 *           type: string
 *           enum: [Pending, Shipped, Delivered, Cancelled]
 *           description: Order status
 *           example: "Shipped"
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *           example:
 *             userID: 1
 *             orderDate: "2025-01-15T10:30:00.000Z"
 *             expectedDeliveryDate: "2025-01-20T10:30:00.000Z"
 *             orderStatus: "Pending"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *             example:
 *               message: "Order created successfully"
 *               order:
 *                 id: 1
 *                 userID: 1
 *                 orderDate: "2025-01-15T10:30:00.000Z"
 *                 expectedDeliveryDate: "2025-01-20T10:30:00.000Z"
 *                 orderStatus: "Pending"
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "userID is required"
 *   get:
 *     summary: Get all orders with user and order details
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders with related data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *             example:
 *               - id: 1
 *                 userID: 1
 *                 orderDate: "2025-01-15T10:30:00.000Z"
 *                 expectedDeliveryDate: "2025-01-20T10:30:00.000Z"
 *                 orderStatus: "Pending"
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T10:30:00.000Z"
 *                 User:
 *                   name: "John Doe"
 *                 OrderDetails:
 *                   - id: 1
 *                     orderID: 1
 *                     productID: 1
 *                     quantity: 2
 *                     total: 1999.98
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *             example:
 *               id: 1
 *               userID: 1
 *               orderDate: "2025-01-15T10:30:00.000Z"
 *               expectedDeliveryDate: "2025-01-20T10:30:00.000Z"
 *               orderStatus: "Pending"
 *               createdAt: "2025-01-15T10:30:00.000Z"
 *               updatedAt: "2025-01-15T10:30:00.000Z"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Order not found"
 *   put:
 *     summary: Update order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderRequest'
 *           example:
 *             orderStatus: "Shipped"
 *             expectedDeliveryDate: "2025-01-22T10:30:00.000Z"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order updated successfully"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *             example:
 *               message: "Order updated successfully"
 *               order:
 *                 id: 1
 *                 userID: 1
 *                 orderDate: "2025-01-15T10:30:00.000Z"
 *                 expectedDeliveryDate: "2025-01-22T10:30:00.000Z"
 *                 orderStatus: "Shipped"
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T12:00:00.000Z"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Order not found"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid order status"
 *   delete:
 *     summary: Delete order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Order not found"
 */

router.post(
  '/',
  validateRequest(createOrderSchema),
  OrderController.createOrder,
);
router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.put(
  '/:id',
  validateRequest(updateOrderSchema),
  OrderController.updateOrder,
);
router.delete('/:id', OrderController.deleteOrder);

export default router;
