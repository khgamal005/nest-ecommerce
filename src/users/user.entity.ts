import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from 'typeorm';
import { Review } from 'src/reviews/review.entity';
import { Product } from 'src/products/product.entity';
import { UserRole } from 'src/utils/enums';


@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '150' })
  name: string;

  @Column({ type: 'varchar', length: '255', unique: true })
  email: string;
  
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'varchar', length: '255' })
  password: string;

  @Column({ type: 'boolean', default: true })
  isAccountVerified: boolean;

  @OneToMany(() => User, user => user.product)
  product: Product[];
  
  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
