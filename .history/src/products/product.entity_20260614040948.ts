import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Review } from 'src/reviews/review.entity';
import { User } from 'src/users/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  
  @Column()
  description: string;

  @ManyToOne(() => User, user => user.products)
  user: User;

  @OneToMany(() => Review, review => review.product )
  reviews: Review[];
  
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
