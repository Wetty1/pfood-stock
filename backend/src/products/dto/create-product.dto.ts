import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Filé de Frango' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ example: 'kg' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ example: 10.5 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  currentQuantity: number;

  @ApiProperty({ example: 5.0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minQuantity: number;

  @ApiProperty({ example: 15.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitPrice?: number;

  @ApiProperty({ example: 'FRG001', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}