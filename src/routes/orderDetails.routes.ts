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
 *     OrderStatus:
 *       type: string
 *       enum:
 *         - Pending
 *         - Shipped
 *         - Delivered
 *         - Cancelled
 *       description: The status of the order
 *
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - userID
 *         - orderStatus
 *       properties:
 *         userID:
 *           type: integer
 *           description: ID of the user placing the order
 *           example: 123
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Date when the order was placed (optional, defaults to current date)
 *           example: "2024-01-15T10:30:00Z"
 *         expectedDeliveryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Expected delivery date for the order
 *           example: "2024-01-20T10:30:00Z"
 *         orderStatus:
 *           $ref: '#/components/schemas/OrderStatus'
 *
 *     UpdateOrderRequest:
 *       type: object
 *       properties:
 *         userID:
 *           type: integer
 *           description: ID of the user
 *           example: 123
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Date when the order was placed
 *           example: "2024-01-15T10:30:00Z"
 *         expectedDeliveryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Expected delivery date for the order
 *           example: "2024-01-20T10:30:00Z"
 *         orderStatus:
 *           $ref: '#/components/schemas/OrderStatus'
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the order
 *           example: 1
 *         userID:
 *           type: integer
 *           description: ID of the user who placed the order
 *           example: 123
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Date when the order was placed
 *           example: "2024-01-15T10:30:00Z"
 *         expectedDeliveryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Expected delivery date for the order
 *           example: "2024-01-20T10:30:00Z"
 *         orderStatus:
 *           $ref: '#/components/schemas/OrderStatus'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order was created
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order was last updated
 *           example: "2024-01-15T10:30:00Z"
 *
 *     ApiError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Validation error"
 *         error:
 *           type: string
 *           description: Error details
 *           example: "userID is required"
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 400
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with the provided details. The orderDate defaults to current date if not provided.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *           examples:
 *             basic_order:
 *               summary: Basic order creation
 *               value:
 *                 userID: 123
 *                 orderStatus: "Pending"
 *             complete_order:
 *               summary: Complete order with all fields
 *               value:
 *                 userID: 123
 *                 orderDate: "2024-01-15T10:30:00Z"
 *                 expectedDeliveryDate: "2024-01-20T10:30:00Z"
 *                 orderStatus: "Pending"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               missing_userID:
 *                 summary: Missing userID
 *                 value:
 *                   message: "Validation error"
 *                   error: "userID is required"
 *                   statusCode: 400
 *               invalid_status:
 *                 summary: Invalid order status
 *                 value:
 *                   message: "Validation error"
 *                   error: "orderStatus must be one of [Pending, Shipped, Delivered, Cancelled]"
 *                   statusCode: 400
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/',
  validateRequest(createOrderSchema),
  OrderController.createOrder,
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieves a list of all orders in the system
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of orders per page
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/OrderStatus'
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
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Orders retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/', OrderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieves a specific order by its unique identifier
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Unique identifier of the order
 *         example: 1
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               message: "Order not found"
 *               error: "No order found with ID: 999"
 *               statusCode: 404
 *       400:
 *         description: Invalid order ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               message: "Invalid order ID"
 *               error: "Order ID must be a positive integer"
 *               statusCode: 400
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:id', OrderController.getOrderById);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an existing order
 *     description: Updates an existing order with the provided details. All fields are optional.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Unique identifier of the order to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderRequest'
 *           examples:
 *             status_update:
 *               summary: Update order status only
 *               value:
 *                 orderStatus: "Shipped"
 *             delivery_date_update:
 *               summary: Update expected delivery date
 *               value:
 *                 expectedDeliveryDate: "2024-01-25T10:30:00Z"
 *             complete_update:
 *               summary: Update multiple fields
 *               value:
 *                 orderStatus: "Delivered"
 *                 expectedDeliveryDate: "2024-01-22T10:30:00Z"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalid_status:
 *                 summary: Invalid order status
 *                 value:
 *                   message: "Validation error"
 *                   error: "orderStatus must be one of [Pending, Shipped, Delivered, Cancelled]"
 *                   statusCode: 400
 *               invalid_date:
 *                 summary: Invalid date format
 *                 value:
 *                   message: "Validation error"
 *                   error: "expectedDeliveryDate must be a valid date"
 *                   statusCode: 400
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               message: "Order not found"
 *               error: "No order found with ID: 999"
 *               statusCode: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.put(
  '/:id',
  validateRequest(updateOrderSchema),
  OrderController.updateOrder,
);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: Permanently deletes an existing order from the system
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Unique identifier of the order to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedOrderId:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               message: "Order not found"
 *               error: "No order found with ID: 999"
 *               statusCode: 404
 *       400:
 *         description: Invalid order ID or order cannot be deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalid_id:
 *                 summary: Invalid order ID
 *                 value:
 *                   message: "Invalid order ID"
 *                   error: "Order ID must be a positive integer"
 *                   statusCode: 400
 *               cannot_delete:
 *                 summary: Order cannot be deleted
 *                 value:
 *                   message: "Cannot delete order"
 *                   error: "Cannot delete order with status 'Delivered'"
 *                   statusCode: 400
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/:id', OrderController.deleteOrder);

export default router;
