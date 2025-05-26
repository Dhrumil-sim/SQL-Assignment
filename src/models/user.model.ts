import { DataTypes, Model, Sequelize } from 'sequelize';

export class User extends Model {
  public id!: number;
  public userName!: string;
  public password!: string;
  public readonly created_on!: Date;
  public readonly updated_on!: Date;
}

export const initUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users', // Optional: specify table name
      timestamps: true,
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
  );

  return User;
};
