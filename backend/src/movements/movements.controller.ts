import { Controller, Get, Post, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MovementType } from './entities/movement.entity';

@ApiTags('movements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @ApiOperation({ summary: 'Criar movimentação' })
  @ApiResponse({ status: 201, description: 'Movimentação criada com sucesso' })
  @Post()
  create(@Body() createMovementDto: CreateMovementDto, @Request() req) {
    return this.movementsService.create(createMovementDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Listar todas as movimentações' })
  @ApiResponse({ status: 200, description: 'Lista de movimentações' })
  @ApiQuery({ name: 'productId', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: MovementType })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @Get()
  findAll(
    @Query('productId') productId?: number,
    @Query('type') type?: MovementType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.movementsService.findAll(productId, type, startDate, endDate);
  }

  @ApiOperation({ summary: 'Buscar movimentação por ID' })
  @ApiResponse({ status: 200, description: 'Movimentação encontrada' })
  @ApiResponse({ status: 404, description: 'Movimentação não encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Resumo de movimentações por período' })
  @ApiResponse({ status: 200, description: 'Resumo de movimentações' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @Get('summary/period')
  getMovementsSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.movementsService.getMovementsSummary(
      new Date(startDate),
      new Date(endDate),
    );
  }
}