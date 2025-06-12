# Order Management System

A Node.js/Express API for managing orders, products, and users with TypeScript and Sequelize ORM.

## 🔗 Repository

**GitHub:** [https://github.com/Dhrumil-sim/SQL-Assignment.git](https://github.com/Dhrumil-sim/SQL-Assignment.git)

## 📋 Project Overview

This is a RESTful API system that handles order management with the following core functionality:

- **User Management** - User registration and authentication
- **Product Catalog** - Product inventory management
- **Order Processing** - Create and manage customer orders
- **Order Details** - Track individual items within orders

## 🗃️ Database Models

The system uses 4 main models with proper relationships:

| Model           | Description                                          |
| --------------- | ---------------------------------------------------- |
| **User**        | Manages user accounts with encrypted passwords       |
| **Product**     | Stores product information including price and stock |
| **Order**       | Handles customer orders with status tracking         |
| **OrderDetail** | Links products to orders with quantities and totals  |

### Key Features

- ✅ **TypeScript** support for type safety
- ✅ **Sequelize ORM** with PostgreSQL/MySQL support
- ✅ **Password encryption** using bcrypt
- ✅ **Foreign key relationships** with cascade delete
- ✅ **Input validation** using Joi schemas
- ✅ **Order status tracking** (Pending → Shipped → Delivered)
- ✅ **Automatic timestamps** for audit trails

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Dhrumil-sim/SQL-Assignment.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start the development server
npm run dev
```

## 📚 API Endpoints

- `POST /api/users` - Create user account
- `GET /api/products` - List all products
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order

## 🛠️ Tech Stack

- **Runtime:** Node.js with Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL/MySQL with Sequelize ORM
- **Validation:** Joi
- **Security:** bcrypt for password hashing
- **Documentation:** Swagger/OpenAPI

## 📄 License

This project is licensed under the MIT License.

---

> **Note:** Replace the GitHub URL with your actual repository link and update any specific details as needed.
