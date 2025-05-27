import { Product } from '../../models/product.model';
import { ICreateProductDTO, IUpdateProductDTO } from './product.dto';

export class ProductService {
  static async createProduct(data: ICreateProductDTO) {
    return await Product.create(data);
  }

  static async getAllProducts() {
    return await Product.findAll({ raw: true });
  }

  static async getProductById(id: number) {
    return await Product.findByPk(id);
  }

  static async updateProduct(id: number, data: IUpdateProductDTO) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    await product.update(data);
    return product;
  }

  static async deleteProduct(id: number) {
    const product = await Product.findByPk(id);
    if (!product) return false;

    await product.destroy();
    return true;
  }
}
