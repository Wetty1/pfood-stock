import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Category } from './src/categories/entities/category.entity';
import { Product } from './src/products/entities/product.entity';
import { Movement } from './src/movements/entities/movement.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'pfood_stock',
  entities: [User, Category, Product, Movement],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});