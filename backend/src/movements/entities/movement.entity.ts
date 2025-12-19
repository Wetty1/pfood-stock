import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

export enum MovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
}

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.movements)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}