import Joi from 'joi';

export interface ICreateProductDTO {
  name: string;
  price: number;
  stock: number;
}

export interface IUpdateProductDTO {
  name?: string;
  price?: number;
  stock?: number;
}

export const createProductSchema = Joi.object<ICreateProductDTO>({
  name: Joi.string().min(1).required(),
  price: Joi.number().positive().precision(2).required(),
  stock: Joi.number().integer().min(0).required(),
});

export const updateProductSchema = Joi.object<IUpdateProductDTO>({
  name: Joi.string().min(1).optional(),
  price: Joi.number().positive().precision(2).optional(),
  stock: Joi.number().integer().min(0).optional(),
});
