import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(categoryId?: number, search?: string): Promise<Product[]> {
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (search) {
      where.name = Like(`%${search}%`);
    }

    return this.productsRepository.find({
      where,
      relations: ['category'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'movements'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.findOne(id);
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async updateQuantity(id: number, quantity: number): Promise<Product> {
    await this.productsRepository.update(id, { currentQuantity: quantity });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async findLowStock(): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.currentQuantity <= product.minQuantity')
      .orderBy('product.currentQuantity', 'ASC')
      .getMany();
  }
}