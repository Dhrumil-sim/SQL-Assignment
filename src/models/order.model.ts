// order.model.ts
import { Sequelize, DataTypes, Model } from 'sequelize';

export class Order extends Model {
  orderID!: number;
  userID!: number;
  orderDate!: Date;
  expectedDeliveryDate!: Date | null;
  orderStatus!: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export const initOrderModel = (sequelize: Sequelize): typeof Order => {
  Order.init(
    {
      orderID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'OrderID',
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        field: 'UserID',
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'OrderDate',
      },
      expectedDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'ExpectedDeliveryDate',
      },
      orderStatus: {
        type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
        allowNull: false,
        field: 'OrderStatus',
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: true,
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
  );

  return Order;
};
