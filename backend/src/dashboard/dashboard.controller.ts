import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Estatísticas do dashboard' })
  @ApiResponse({ status: 200, description: 'Estatísticas gerais do sistema' })
  @Get('stats')
  getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @ApiOperation({ summary: 'Gráfico de movimentações' })
  @ApiResponse({ status: 200, description: 'Dados para gráfico de movimentações por dia' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Número de dias (padrão: 7)' })
  @Get('movements-chart')
  getMovementsChart(@Query('days') days?: number) {
    return this.dashboardService.getMovementsChart(days ? +days : 7);
  }

  @ApiOperation({ summary: 'Gráfico de categorias' })
  @ApiResponse({ status: 200, description: 'Dados para gráfico de produtos por categoria' })
  @Get('categories-chart')
  getCategoriesChart() {
    return this.dashboardService.getCategoriesChart();
  }
}