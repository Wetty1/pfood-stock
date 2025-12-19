import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Carnes' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Produtos cárneos em geral', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}