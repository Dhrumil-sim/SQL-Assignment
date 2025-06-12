import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest/validateRequest';
import {
  createOrderSchema,
  updateOrderSchema,
} from '../modules/order/order.dto';
import { OrderController } from '../modules/order/order.controller';

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
 *     OrderDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Order detail ID
 *         orderID:
 *           type: integer
 *           description: Order ID (Foreign Key)
 *         productID:
 *           type: integer
 *           description: Product ID (Foreign Key)
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity ordered
 *         price:
 *           type: number
 *           format: decimal
 *           description: Price at time of order
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - userID
 *         - orderStatus
 *       properties:
 *         userID:
 *           type: integer
 *           description: User ID who is placing the order
 *           example: 123
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Order date (optional, defaults to current date)
 *           example: "2025-01-15T10:30:00.000Z"
 *         expectedDeliveryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Expected delivery date (optional)
 *           example: "2025-01-20T00:00:00.000Z"
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
 *           example: 123
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
 *           example: "2025-01-20T00:00:00.000Z"
 *         orderStatus:
 *           type: string
 *           enum: [Pending, Shipped, Delivered, Cancelled]
 *           description: Order status
 *           example: "Shipped"
 *     CreateOrderDetailRequest:
 *       type: object
 *       required:
 *         - orderID
 *         - productID
 *         - quantity
 *       properties:
 *         orderID:
 *           type: integer
 *           description: Order ID (Foreign Key)
 *           example: 1
 *         productID:
 *           type: integer
 *           description: Product ID (Foreign Key)
 *           example: 1
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity to order
 *           example: 2
 *     UpdateOrderDetailRequest:
 *       type: object
 *       properties:
 *         orderID:
 *           type: integer
 *           description: Order ID (Foreign Key)
 *           example: 1
 *         productID:
 *           type: integer
 *           description: Product ID (Foreign Key)
 *           example: 1
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity to order
 *           example: 3
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
 *             userID: 123
 *             orderDate: "2025-01-15T10:30:00.000Z"
 *             expectedDeliveryDate: "2025-01-20T00:00:00.000Z"
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
 *                 userID: 123
 *                 orderDate: "2025-01-15T10:30:00.000Z"
 *                 expectedDeliveryDate: "2025-01-20T00:00:00.000Z"
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
 *     summary: Get all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: orderStatus
 *         schema:
 *           type: string
 *           enum: [Pending, Shipped, Delivered, Cancelled]
 *         description: Filter orders by status
 *         example: "Pending"
 *       - in: query
 *         name: userID
 *         schema:
 *           type: integer
 *         description: Filter orders by user ID
 *         example: 123
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *             example:
 *               - id: 1
 *                 userID: 123
 *                 orderDate: "2025-01-15T10:30:00.000Z"
 *                 expectedDeliveryDate: "2025-01-20T00:00:00.000Z"
 *                 orderStatus: "Pending"
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T10:30:00.000Z"
 *               - id: 2
 *                 userID: 456
 *                 orderDate: "2025-01-15T11:00:00.000Z"
 *                 expectedDeliveryDate: "2025-01-22T00:00:00.000Z"
 *                 orderStatus: "Shipped"
 *                 createdAt: "2025-01-15T11:00:00.000Z"
 *                 updatedAt: "2025-01-15T12:00:00.000Z"
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
 *               userID: 123
 *               orderDate: "2025-01-15T10:30:00.000Z"
 *               expectedDeliveryDate: "2025-01-20T00:00:00.000Z"
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
 *             expectedDeliveryDate: "2025-01-22T00:00:00.000Z"
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
 *                 userID: 123
 *                 orderDate: "2025-01-15T10:30:00.000Z"
 *                 expectedDeliveryDate: "2025-01-22T00:00:00.000Z"
 *                 orderStatus: "Shipped"
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T14:00:00.000Z"
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
