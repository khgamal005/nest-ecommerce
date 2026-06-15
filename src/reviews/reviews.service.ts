import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from 'src/utils/enums';
import { Review } from './review.entity';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({ relations: { user: true, product: true } });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: { user: true, product: true }
    });
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  async create(createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const product = await this.productRepository.findOne({ where: { id: createReviewDto.productId } });
    if (!product) {
      throw new NotFoundException(`Product with id ${createReviewDto.productId} not found`);
    }

    const newReview = this.reviewRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      user,
      product,
    });
    return await this.reviewRepository.save(newReview);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number, userRole: UserRole): Promise<Review> {
    const review = await this.findOne(id);

    if (review.user.id !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    if (updateReviewDto.rating) {
      review.rating = updateReviewDto.rating;
    }

    if (updateReviewDto.comment) {
      review.comment = updateReviewDto.comment;
    }

    return await this.reviewRepository.save(review);
  }

  async remove(id: number, userId: number, userRole: UserRole): Promise<void> {
    const review = await this.findOne(id);

    if (review.user.id !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }
}
