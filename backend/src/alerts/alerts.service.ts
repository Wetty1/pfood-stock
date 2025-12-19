import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

export interface Alert {
  id: number;
  productId: number;
  productName: string;
  categoryName: string;
  currentQuantity: number;
  minQuantity: number;
  unit: string;
  level: 'CRITICAL' | 'WARNING';
}

@Injectable()
export class AlertsService {
  constructor(private productsService: ProductsService) {}

  async getAlerts(): Promise<Alert[]> {
    const lowStockProducts = await this.productsService.findLowStock();
    
    return lowStockProducts.map(product => ({
      id: product.id,
      productId: product.id,
      productName: product.name,
      categoryName: product.category.name,
      currentQuantity: Number(product.currentQuantity),
      minQuantity: Number(product.minQuantity),
      unit: product.unit,
      level: Number(product.currentQuantity) === 0 ? 'CRITICAL' : 'WARNING',
    }));
  }

  async getAlertsCount(): Promise<number> {
    const alerts = await this.getAlerts();
    return alerts.length;
  }

  async getCriticalAlertsCount(): Promise<number> {
    const alerts = await this.getAlerts();
    return alerts.filter(alert => alert.level === 'CRITICAL').length;
  }
}