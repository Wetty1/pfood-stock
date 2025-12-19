import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @ApiOperation({ summary: 'Listar todos os alertas' })
  @ApiResponse({ status: 200, description: 'Lista de alertas de estoque baixo' })
  @Get()
  getAlerts() {
    return this.alertsService.getAlerts();
  }

  @ApiOperation({ summary: 'Contar alertas' })
  @ApiResponse({ status: 200, description: 'Número total de alertas' })
  @Get('count')
  getAlertsCount() {
    return this.alertsService.getAlertsCount();
  }

  @ApiOperation({ summary: 'Contar alertas críticos' })
  @ApiResponse({ status: 200, description: 'Número de alertas críticos' })
  @Get('critical/count')
  getCriticalAlertsCount() {
    return this.alertsService.getCriticalAlertsCount();
  }
}