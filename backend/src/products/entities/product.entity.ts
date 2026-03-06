import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Movement } from '../../movements/entities/movement.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  unit: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentQuantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  minQuantity: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  baseProduct: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @OneToMany(() => Movement, (movement) => movement.product)
  movements: Movement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}