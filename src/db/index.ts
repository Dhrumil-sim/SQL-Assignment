import { Sequelize } from 'sequelize';
import dbConfig from './db.config';
import { initUserModel } from '../models/user.model';
import { initProductModel } from '../models/product.model';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: 'postgres',
  logging: true, // or true to log SQL
});

// Initialize all models here
const User = initUserModel(sequelize);
const Product = initProductModel(sequelize);
// Sync the database
const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Creates tables if not exist
    console.log('✅ PostgreSQL connected and tables created');
  } catch (error) {
    console.error('❌ DB connection error:', error);
    throw error;
  }
};

export { sequelize, User, Product };
export default connectDB;
