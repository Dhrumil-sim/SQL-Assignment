import { Request, Response } from 'express';
import { asyncHandler } from '../../utils';
import { Order } from '../../models/order.model';
import { StatusCodes } from 'http-status-codes';
import { OrderDetail } from '../../models/order.details.model';
import { ICreateOrderDetailDTO, IUpdateOrderDetailDTO } from './order.dto';
import { Product, sequelize, User } from '../../db';
import { Op } from 'sequelize';

export class OrderController {
  // CREATE Order
  static createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { userID, orderDate, expectedDeliveryDate, orderStatus } = req.body;

    const order = await Order.create({
      userID,
      orderDate,
      expectedDeliveryDate,
      orderStatus,
    });

    return res.status(StatusCodes.CREATED).json({
      message: 'Order created successfully',
      order,
    });
  });

  // GET All Orders
  static getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['userName'] },
        {
          model: OrderDetail,
          include: [{ model: Product, attributes: ['name'] }],
        },
      ],
    });

    return res.status(StatusCodes.OK).json(orders);
  });

  // GET Order by ID
  static getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findByPk(Number(id));
    console.log(order);
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Order not found' });
    }

    return res.status(StatusCodes.OK).json(order);
  });

  // UPDATE Order
  static updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userID, orderDate, expectedDeliveryDate, orderStatus } = req.body;

    const order = await Order.findByPk(Number(id));

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Order not found' });
    }

    await order.update({
      userID,
      orderDate,
      expectedDeliveryDate,
      orderStatus,
    });

    return res.status(StatusCodes.OK).json({
      message: 'Order updated successfully',
      order,
    });
  });

  // DELETE Order
  static deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findByPk(Number(id));

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Order not found' });
    }

    await order.destroy();

    return res.status(StatusCodes.NO_CONTENT).send();
  });

  static createOrderDetail = asyncHandler(
    async (req: Request, res: Response) => {
      const { orderID, productID, quantity }: ICreateOrderDetailDTO = req.body;

      // Check Order Exists
      const order = await Order.findByPk(orderID);
      if (!order) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Invalid orderID' });
      }

      // Check Product Exists
      const product = await Product.findByPk(productID);
      if (!product) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Invalid productID' });
      }

      // Check Quantity Valid
      if (!quantity || quantity <= 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Quantity must be greater than 0' });
      }

      // Check Stock
      if (quantity > product.stock) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Insufficient stock. Available stock: ${product.stock}`,
        });
      }

      // Check if same product already added in same order
      const existingDetail = await OrderDetail.findOne({
        where: { orderID, productID },
      });

      if (existingDetail) {
        return res.status(StatusCodes.CONFLICT).json({
          message:
            'Product already exists in the order. Consider updating the quantity instead.',
        });
      }

      // All good — Proceed with transaction
      const transaction = await OrderDetail.sequelize!.transaction();

      try {
        const total = Number(product.dataValues.price) * quantity;
        console.log(product.dataValues.price);
        console.log('Total :', total);
        const detail = await OrderDetail.create(
          {
            orderID,
            productID,
            quantity,
            total,
          },
          { transaction },
        );

        console.log('Stock', product.stock);
        // Deduct stock from product
        await product.update(
          { stock: Number(product.dataValues.stock) - quantity },
          { transaction },
        );

        await transaction.commit();
        return res.status(StatusCodes.CREATED).json({
          message: 'Order detail created successfully',
          detail,
        });
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    },
  );

  // GET ALL Order Details
  static getAllOrderDetails = asyncHandler(
    async (_req: Request, res: Response) => {
      const details = await OrderDetail.findAll();
      return res.status(StatusCodes.OK).json({ details });
    },
  );

  // GET Order Detail by ID
  static getOrderDetailById = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const detail = await OrderDetail.findByPk(Number(id));

      if (!detail) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Order detail not found' });
      }

      return res.status(StatusCodes.OK).json({ detail });
    },
  );

  // UPDATE Order Detail
  static updateOrderDetail = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const payload: IUpdateOrderDetailDTO = req.body;

      const detail = await OrderDetail.findByPk(Number(id));

      if (!detail) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Order detail not found' });
      }

      await detail.update(payload);

      return res.status(StatusCodes.OK).json({
        message: 'Order detail updated successfully',
        detail,
      });
    },
  );

  // DELETE Order Detail
  static deleteOrderDetail = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const detail = await OrderDetail.findByPk(Number(id));

      if (!detail) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Order detail not found' });
      }

      await detail.destroy();

      return res.status(StatusCodes.NO_CONTENT).send();
    },
  );

  static summaryReport = asyncHandler(async (_req: Request, res: Response) => {
    const undeliveredOrders = await Order.findAll({
      where: { expectedDeliveryDate: null },
      include: [User],
      raw: true,
    });

    const recentOrders = await Order.findAll({
      include: [{ model: User, attributes: ['userName'] }],
      order: [['orderDate', 'DESC']],
      limit: 5,
    });

    const topUsers = this.topUsers;

    const inactiveUsers = this.inactiveUsers;

    const topProducts = this.topProducts;

    const orderTotals = await OrderDetail.findAll({
      attributes: [
        'orderID',
        [sequelize.fn('SUM', sequelize.col('total')), 'total'],
      ],
      group: ['orderID'],
      order: [[sequelize.literal('total'), 'DESC']],
      raw: true,
    });

    const mostExpensive = orderTotals[0];
    const cheapest = orderTotals[orderTotals.length - 1];

    return res.status(StatusCodes.OK).json({
      undeliveredOrders,
      recentOrders,
      topUsers,
      inactiveUsers,
      topProducts,
      mostExpensive,
      cheapest,
    });
  });

  static topUsers = asyncHandler(async () => {
    const topUsers = await Order.findAll({
      attributes: [
        'userID',
        [sequelize.fn('COUNT', sequelize.col('"UserID"')), 'orderCount'],
      ],
      include: [{ model: User, attributes: ['userName'] }],
      group: ['userID', 'User.id'],
      order: [[sequelize.literal('2'), 'DESC']],
      limit: 5,
      raw: true,
    });
    return topUsers;
  });

  static inactiveUsers = asyncHandler(async () => {
    const inactiveUsers = await User.findAll({
      where: {
        id: {
          [Op.notIn]: sequelize.literal(
            `(SELECT DISTINCT "UserID" FROM "orders")`,
          ),
        },
      },
      attributes: ['id', 'userName'],
    });
    return inactiveUsers;
  });

  static topProducts = asyncHandler(async () => {
    const topProducts = await OrderDetail.findAll({
      attributes: [
        'productID',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
      ],
      include: [{ model: Product, attributes: ['name'] }],
      group: ['productID', 'Product.id'],
      order: [[sequelize.literal('2'), 'DESC']],
      limit: 5,
      raw: true,
    });
    return topProducts;
  });
}
