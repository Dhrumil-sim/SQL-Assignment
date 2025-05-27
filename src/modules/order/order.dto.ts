import Joi from 'joi';

// Allowed values for orderStatus
export const allowedOrderStatuses = [
  'Pending',
  'Shipped',
  'Delivered',
  'Cancelled',
] as const;
export type OrderStatus = (typeof allowedOrderStatuses)[number];

export interface ICreateOrderDTO {
  userID: number; // mandatory now
  orderDate?: Date;
  expectedDeliveryDate?: Date | null;
  orderStatus: OrderStatus;
}

export interface IUpdateOrderDTO {
  userID?: number;
  orderDate?: Date;
  expectedDeliveryDate?: Date | null;
  orderStatus?: OrderStatus;
}

// Joi schema for validation
export const createOrderSchema = Joi.object<ICreateOrderDTO>({
  userID: Joi.number().required(), // required now
  orderDate: Joi.date().optional(), // optional as default is NOW
  expectedDeliveryDate: Joi.date().optional().allow(null),
  orderStatus: Joi.string()
    .valid(...allowedOrderStatuses)
    .required(),
});

export const updateOrderSchema = Joi.object<IUpdateOrderDTO>({
  userID: Joi.number().optional(),
  orderDate: Joi.date().optional(),
  expectedDeliveryDate: Joi.date().optional().allow(null),
  orderStatus: Joi.string()
    .valid(...allowedOrderStatuses)
    .optional(),
});

export interface ICreateOrderDetailDTO {
  orderID: number; // FK to order
  productID: number; // FK to product
  quantity: number;
  price: number;
}

export interface IUpdateOrderDetailDTO {
  orderID?: number;
  productID?: number;
  quantity?: number;
  price?: number;
}

export const createOrderDetailSchema = Joi.object<ICreateOrderDetailDTO>({
  orderID: Joi.number().required(),
  productID: Joi.number().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const updateOrderDetailSchema = Joi.object<IUpdateOrderDetailDTO>({
  orderID: Joi.number().optional(),
  productID: Joi.number().optional(),
  quantity: Joi.number().integer().min(1).optional(),
});
