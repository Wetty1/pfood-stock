import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Criar produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get()
  findAll(
    @Query('categoryId') categoryId?: number,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(categoryId, search);
  }

  @ApiOperation({ summary: 'Listar produtos com estoque baixo' })
  @ApiResponse({ status: 200, description: 'Lista de produtos com estoque baixo' })
  @Get('low-stock')
  findLowStock() {
    return this.productsService.findLowStock();
  }

  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @ApiOperation({ summary: 'Remover produto' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}