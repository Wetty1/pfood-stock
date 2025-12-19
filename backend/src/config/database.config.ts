import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Movement } from '../movements/entities/movement.entity';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_NAME', 'pfood_stock'),
    entities: [User, Category, Product, Movement],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    migrationsRun: configService.get('NODE_ENV') === 'production',
    logging: configService.get('NODE_ENV') === 'development',
  }),
};

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'pfood_stock',
  entities: [User, Category, Product, Movement],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  migrationsRun: true,
});