import { Request, Response, Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest/validateRequest';
import { createUserSchema } from '../modules/user/user.dto';
import { UserController } from '../modules/user/user.controller';
const router = Router();

router.post('/', validateRequest(createUserSchema), UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
export default router;
