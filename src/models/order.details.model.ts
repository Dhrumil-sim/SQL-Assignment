// orderDetail.model.ts
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface OrderDetailAttributes {
  id: number;
  orderID: number;
  productID: number;
  quantity: number;
  total: number;
}

export type OrderDetailCreationAttributes = Optional<
  OrderDetailAttributes,
  'id'
>;

export class OrderDetail
  extends Model<OrderDetailAttributes, OrderDetailCreationAttributes>
  implements OrderDetailAttributes
{
  public id!: number;
  public orderID!: number;
  public productID!: number;
  public quantity!: number;
  public total!: number;
}

export const initOrderDetailModel = (
  sequelize: Sequelize,
): typeof OrderDetail => {
  OrderDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'OrderID',
        },
        onDelete: 'CASCADE',
        field: 'OrderID',
      },
      productID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
        field: 'ProductID',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // or use hooks safely
      },
    },
    {
      sequelize,
      modelName: 'OrderDetail',
      tableName: 'order_details',
      timestamps: true,
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
  );

  return OrderDetail;
};
