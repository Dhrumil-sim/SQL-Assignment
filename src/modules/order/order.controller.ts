import { Request, Response } from 'express';
import { asyncHandler } from '../../utils';
import { Order } from '../../models/order.model';
import { StatusCodes } from 'http-status-codes';
import { OrderDetail } from '../../models/order.details.model';
import { ICreateOrderDetailDTO, IUpdateOrderDetailDTO } from './order.dto';
import { Product } from '../../db';

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
    const orders = await Order.findAll();
    return res.status(StatusCodes.OK).json(orders);
  });

  // GET Order by ID
  static getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findByPk(Number(id));

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
      const product = await Product.findByPk(productID, { raw: true });
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
        const total = product.price * quantity;
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
}
