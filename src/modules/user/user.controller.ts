import { Request, Response } from 'express';
import { asyncHandler } from '../../utils';
import { User } from '../../models/user.model';
import { StatusCodes } from 'http-status-codes';

export class UserController {
  // CREATE a new user
  static createUser = asyncHandler(async (req: Request, res: Response) => {
    const { userName, password } = req.body;

    const existingUser = await User.findOne({ where: { userName } });
    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: 'Username already exists' });
    }

    const user = await User.create({ userName, password });

    return res.status(StatusCodes.CREATED).json({
      message: 'User created successfully',
      user,
    });
  });

  // GET all users
  static getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await User.findAll();
    return res.status(StatusCodes.OK).json(users);
  });

  // GET a single user by ID
  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    return res.status(StatusCodes.OK).json(user);
  });

  // UPDATE a user
  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userName, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    user.update({
      userName: userName,
      password: password,
    });

    await user.save();

    return res.status(StatusCodes.OK).json({
      message: 'User updated successfully',
      user,
    });
  });

  // DELETE a user
  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    await user.destroy();

    return res.status(StatusCodes.NO_CONTENT).send();
  });
}
