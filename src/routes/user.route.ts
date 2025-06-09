import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest/validateRequest';
import { createUserSchema, updateUserSchema } from '../modules/user/user.dto';
import { UserController } from '../modules/user/user.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *         userName:
 *           type: string
 *           description: Username
 *         password:
 *           type: string
 *           description: User password
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - userName
 *         - password
 *       properties:
 *         userName:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: Username (3-30 characters)
 *           example: "john_doe"
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Password (minimum 6 characters)
 *           example: "password123"
 *     UpdateUserRequest:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         userName:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: Username (3-30 characters)
 *           example: "john_doe_updated"
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Password (minimum 6 characters)
 *           example: "newpassword123"
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           example:
 *             userName: "john_doe"
 *             password: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               message: "User created successfully"
 *               user:
 *                 id: 1
 *                 userName: "john_doe"
 *                 password: "$2b$10$..."
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T10:30:00.000Z"
 *       409:
 *         description: Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Username already exists"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Username is required"
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: 1
 *                 userName: "john_doe"
 *                 password: "$2b$10$..."
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T10:30:00.000Z"
 *               - id: 2
 *                 userName: "jane_smith"
 *                 password: "$2b$10$..."
 *                 createdAt: "2025-01-15T11:00:00.000Z"
 *                 updatedAt: "2025-01-15T11:00:00.000Z"
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               userName: "john_doe"
 *               password: "$2b$10$..."
 *               createdAt: "2025-01-15T10:30:00.000Z"
 *               updatedAt: "2025-01-15T10:30:00.000Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "User not found"
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           example:
 *             userName: "john_doe_updated"
 *             password: "newpassword123"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               message: "User updated successfully"
 *               user:
 *                 id: 1
 *                 userName: "john_doe_updated"
 *                 password: "$2b$10$..."
 *                 createdAt: "2025-01-15T10:30:00.000Z"
 *                 updatedAt: "2025-01-15T12:00:00.000Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "User not found"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "At least one field (userName or password) must be provided"
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "User not found"
 */

router.post('/', validateRequest(createUserSchema), UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put(
  '/:id',
  validateRequest(updateUserSchema),
  UserController.updateUser,
);
router.delete('/:id', UserController.deleteUser);

export default router;
