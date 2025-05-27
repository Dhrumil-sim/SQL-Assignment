import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { asyncHandler } from '../../utils';
import { StatusCodes } from 'http-status-codes';

export class ProductController {
  static createProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.createProduct(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: 'Product created successfully',
      product,
    });
  });

  static getAllProducts = asyncHandler(async (_req: Request, res: Response) => {
    const products = await ProductService.getAllProducts();
    return res.status(StatusCodes.OK).json(products);
  });

  static getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await ProductService.getProductById(Number(id));

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' });
    }

    return res.status(StatusCodes.OK).json(product);
  });

  static updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedProduct = await ProductService.updateProduct(
      Number(id),
      req.body,
    );

    if (!updatedProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' });
    }

    return res.status(StatusCodes.OK).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  });

  static deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await ProductService.deleteProduct(Number(id));

    if (!deleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
  });
}
