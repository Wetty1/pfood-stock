import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ProductsModule } from '../products/products.module';
import { MovementsModule } from '../movements/movements.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [ProductsModule, MovementsModule, AlertsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}