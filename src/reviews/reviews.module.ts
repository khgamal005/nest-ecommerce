import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
  imports: [TypeOrmModule.forFeature([Review, User, Product])],
})
export class ReviewsModule {}
