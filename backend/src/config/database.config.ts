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
    url: configService.get('DATABASE_URL'),
    entities: [User, Category, Product, Movement],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    migrationsRun: configService.get('NODE_ENV') === 'production',
    logging: configService.get('LOGGING') === 'true',
    ssl: configService.get('DATABASE_URL')
      ? { rejectUnauthorized: false }
      : false,
  }),
};

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Category, Product, Movement],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  migrationsRun: true,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});