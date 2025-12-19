import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { MovementsModule } from './movements/movements.module';
import { AlertsModule } from './alerts/alerts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    MovementsModule,
    AlertsModule,
    DashboardModule,
  ],
})
export class AppModule {}