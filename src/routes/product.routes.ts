import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest/validateRequest';
import {
  createProductSchema,
  updateProductSchema,
} from '../modules/product/product.dto';
import { ProductController } from '../modules/product/product.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name
 *         price:
 *           type: number
 *           format: decimal
 *           description: Product price
 *         stock:
 *           type: integer
 *           description: Available stock
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           description: Product name
 *           example: "iPhone 15 Pro"
 *         price:
 *           type: number
 *           minimum: 0.01
 *           multipleOf: 0.01
 *           description: Product price (positive, up to 2 decimal places)
 *           example: 999.99
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: Available stock (non-negative integer)
 *           example: 50
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           description: Product name
 *           example: "iPhone 15 Pro Max"
 *         price:
 *           type: number
 *           minimum: 0.01
 *           multipleOf: 0.01
 *           description: Product price (positive, up to 2 decimal places)
 *           example: 1199.99
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: Available stock (non-negative integer)
 *           example: 30
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           example:
 *             name: "iPhone 15 Pro"
 *             price: 999.99
 *             stock: 50
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *             example:
 *               message: "Product created successfully"
 *               product:
 *                 id: 1
 *                 name: "iPhone 15 Pro"
 *                 price: 999.99
 *                 stock: 50
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Product name is required"
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             example:
 *               - id: 1
 *                 name: "iPhone 15 Pro"
 *                 price: 999.99
 *                 stock: 50
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T10:30:00.000Z"
 *               - id: 2
 *                 name: "Samsung Galaxy S24"
 *                 price: 799.99
 *                 stock: 30
 *                 createdAt: "2025-01-15T11:00:00.000Z"
 *                 updatedAt: "2025-01-15T11:00:00.000Z"
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 1
 *               name: "iPhone 15 Pro"
 *               price: 999.99
 *               stock: 50
 *               createdAt: "2025-01-15T10:30:00.000Z"
 *               updatedAt: "2025-01-15T10:30:00.000Z"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Product not found"
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *           example:
 *             name: "iPhone 15 Pro Max"
 *             price: 1199.99
 *             stock: 30
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *             example:
 *               message: "Product updated successfully"
 *               product:
 *                 id: 1
 *                 name: "iPhone 15 Pro Max"
 *                 price: 1199.99
 *                 stock: 30
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T12:00:00.000Z"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Product not found"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Price must be a positive number"
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Product not found"
 */

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
