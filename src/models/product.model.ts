import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Interfaces for model attributes and creation attributes
export interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_on?: Date;
  updated_on?: Date;
}

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  'id' | 'created_on' | 'updated_on'
>;

// Define the Product model using generics
export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public price!: number;
  public stock!: number;

  public readonly created_on!: Date;
  public readonly updated_on!: Date;
}

// Initialize the Product model
export const initProductModel = (sequelize: Sequelize): typeof Product => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
  );
  return Product;
};
