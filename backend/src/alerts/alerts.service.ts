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
  productsCount?: number;
  products?: Array<{
    id: number;
    name: string;
    brand?: string;
    currentQuantity: number;
    sku?: string;
  }>;
}

@Injectable()
export class AlertsService {
  constructor(private productsService: ProductsService) {}

  async getAlerts(): Promise<Alert[]> {
    const products = await this.productsService.findAll();
    
    // Agrupar por baseProduct ou nome se baseProduct não existir
    const groupedProducts = products.reduce((acc, product) => {
      const key = product.baseProduct || product.name;
      if (!acc[key]) {
        acc[key] = {
          products: [],
          totalQuantity: 0,
          minQuantity: 0,
          unit: product.unit,
          categoryName: product.category.name
        };
      }
      acc[key].products.push(product);
      acc[key].totalQuantity += Number(product.currentQuantity);
      acc[key].minQuantity = Math.max(acc[key].minQuantity, Number(product.minQuantity));
      return acc;
    }, {});

    // Gerar alertas para grupos com estoque baixo
    return Object.entries(groupedProducts)
      .filter(([_, group]: [string, any]) => group.totalQuantity < 2 * group.minQuantity)
      .map(([name, group]: [string, any]) => ({
        id: group.products[0].id,
        productId: group.products[0].id,
        productName: name,
        categoryName: group.categoryName,
        currentQuantity: group.totalQuantity,
        minQuantity: group.minQuantity,
        unit: group.unit,
        level: group.totalQuantity < group.minQuantity ? 'CRITICAL' : 'WARNING',
        productsCount: group.products.length,
        products: group.products.map(product => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          currentQuantity: Number(product.currentQuantity),
          sku: product.sku,
        })),
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