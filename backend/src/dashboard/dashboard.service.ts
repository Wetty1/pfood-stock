import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { MovementsService } from '../movements/movements.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class DashboardService {
  constructor(
    private productsService: ProductsService,
    private movementsService: MovementsService,
    private alertsService: AlertsService,
  ) {}

  async getDashboardStats() {
    const [products, alerts, alertsCount] = await Promise.all([
      this.productsService.findAll(),
      this.alertsService.getAlerts(),
      this.alertsService.getAlertsCount(),
    ]);

    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, product) => {
      const value = Number(product.currentQuantity) * Number(product.unitPrice || 0);
      return sum + value;
    }, 0);

    // Últimos 30 dias
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const movementsSummary = await this.movementsService.getMovementsSummary(startDate, endDate);

    return {
      totalProducts,
      alertsCount,
      criticalAlertsCount: alerts.filter(a => a.level === 'CRITICAL').length,
      totalStockValue: Number(totalStockValue.toFixed(2)),
      last30Days: movementsSummary,
    };
  }

  async getMovementsChart(days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const movements = await this.movementsService.getMovementsByDateRange(startDate, endDate);
    
    const chartData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMovements = movements.filter(m => 
        m.createdAt.toISOString().split('T')[0] === dateStr
      );
      
      const entries = dayMovements.filter(m => m.type === 'ENTRY').length;
      const exits = dayMovements.filter(m => m.type === 'EXIT').length;
      
      chartData.push({
        date: dateStr,
        entries,
        exits,
      });
    }

    return chartData;
  }

  async getCategoriesChart() {
    const products = await this.productsService.findAll();
    const categoriesMap = new Map();

    products.forEach(product => {
      const categoryName = product.category.name;
      if (categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, categoriesMap.get(categoryName) + 1);
      } else {
        categoriesMap.set(categoryName, 1);
      }
    });

    return Array.from(categoriesMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }
}