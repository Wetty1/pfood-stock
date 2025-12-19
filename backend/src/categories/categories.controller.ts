import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Criar categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({ status: 200, description: 'Lista de categorias' })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Remover categoria' })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}