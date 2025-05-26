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
        field: 'OrderID', // maps to column name
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users', // name of the referenced table
          key: 'id', // referenced column
        },
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
      timestamps: false, // since your table does not have createdAt or updatedAt columns
    },
  );

  return Order;
};
