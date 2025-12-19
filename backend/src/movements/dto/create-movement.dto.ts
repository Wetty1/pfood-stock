import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MovementType } from '../entities/movement.entity';

export class CreateMovementDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  productId: number;

  @ApiProperty({ enum: MovementType, example: MovementType.ENTRY })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ example: 10.5 })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ example: 'Compra de fornecedor', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ example: 'Fornecedor ABC Ltda', required: false })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiProperty({ example: 'NF-12345', required: false })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({ example: 'Produto em perfeito estado', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}