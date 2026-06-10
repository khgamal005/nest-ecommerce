import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const user = await this.userRepository.findOne({ where: { id: createReviewDto.userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${createReviewDto.userId} not found`);
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

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);

    if (updateReviewDto.userId) {
      const user = await this.userRepository.findOne({ where: { id: updateReviewDto.userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${updateReviewDto.userId} not found`);
      }
      review.user = user;
    }

    if (updateReviewDto.productId) {
      const product = await this.productRepository.findOne({ where: { id: updateReviewDto.productId } });
      if (!product) {
        throw new NotFoundException(`Product with id ${updateReviewDto.productId} not found`);
      }
      review.product = product;
    }

    if (updateReviewDto.rating) {
      review.rating = updateReviewDto.rating;
    }

    if (updateReviewDto.comment) {
      review.comment = updateReviewDto.comment;
    }

    return await this.reviewRepository.save(review);
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }
}
