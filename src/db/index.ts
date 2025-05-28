import { Sequelize } from 'sequelize';
import dbConfig from './db.config';
import { initUserModel } from '../models/user.model';
import { initProductModel } from '../models/product.model';
import { initOrderModel } from '../models/order.model';
import { initOrderDetailModel } from '../models/order.details.model';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: 'postgres',
  logging: (sql, timing) => {
    if (timing !== undefined) {
      console.log(`[SQL] ${sql} - Execution time: ${timing}ms`);
    } else {
      console.log(`[SQL] ${sql}`);
    }
  },
  benchmark: true,
});

// Initialize all models here
const User = initUserModel(sequelize);
const Product = initProductModel(sequelize);
const Order = initOrderModel(sequelize);
const OrderDetails = initOrderDetailModel(sequelize);
User.hasMany(Order, { foreignKey: 'userID' });
Order.belongsTo(User, { foreignKey: 'userID' });

Order.hasMany(OrderDetails, { foreignKey: 'orderID' });
OrderDetails.belongsTo(Order, { foreignKey: 'orderID' });

OrderDetails.belongsTo(Product, { foreignKey: 'productID' });
Product.hasMany(OrderDetails, { foreignKey: 'productID' });
// Sync the database
const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Creates tables if not exist
  } catch (error) {
    console.error('❌ DB connection error:', error);
    throw error;
  }
};

export { sequelize, User, Product, Order, OrderDetails };
export default connectDB;
