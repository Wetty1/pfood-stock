import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Movement, MovementType } from './entities/movement.entity';
import { CreateMovementDto } from './dto/create-movement.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private movementsRepository: Repository<Movement>,
    private productsService: ProductsService,
  ) {}

  async create(createMovementDto: CreateMovementDto, userId: number): Promise<Movement> {
    const product = await this.productsService.findOne(createMovementDto.productId);
    
    if (createMovementDto.type === MovementType.EXIT) {
      if (product.currentQuantity < createMovementDto.quantity) {
        throw new BadRequestException('Quantidade insuficiente em estoque');
      }
    }

    const movement = this.movementsRepository.create({
      ...createMovementDto,
      userId,
    });

    const savedMovement = await this.movementsRepository.save(movement);

    // Atualizar quantidade do produto
    const newQuantity = createMovementDto.type === MovementType.ENTRY
      ? Number(product.currentQuantity) + Number(createMovementDto.quantity)
      : Number(product.currentQuantity) - Number(createMovementDto.quantity);

    await this.productsService.updateQuantity(createMovementDto.productId, newQuantity);

    return this.findOne(savedMovement.id);
  }

  async findAll(
    productId?: number,
    type?: MovementType,
    startDate?: string,
    endDate?: string,
  ): Promise<Movement[]> {
    const where: any = {};
    
    if (productId) {
      where.productId = productId;
    }
    
    if (type) {
      where.type = type;
    }

    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    return this.movementsRepository.find({
      where,
      relations: ['product', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Movement> {
    const movement = await this.movementsRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });

    if (!movement) {
      throw new NotFoundException('Movimentação não encontrada');
    }

    return movement;
  }

  async getMovementsByDateRange(startDate: Date, endDate: Date): Promise<Movement[]> {
    return this.movementsRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['product', 'product.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMovementsSummary(startDate: Date, endDate: Date) {
    const movements = await this.getMovementsByDateRange(startDate, endDate);
    
    const entries = movements.filter(m => m.type === MovementType.ENTRY);
    const exits = movements.filter(m => m.type === MovementType.EXIT);
    
    return {
      totalEntries: entries.length,
      totalExits: exits.length,
      totalEntriesQuantity: entries.reduce((sum, m) => sum + Number(m.quantity), 0),
      totalExitsQuantity: exits.reduce((sum, m) => sum + Number(m.quantity), 0),
    };
  }
}