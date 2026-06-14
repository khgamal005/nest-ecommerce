import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('')
  public getAllReviews(): Promise<Review[]> {
    return this.reviewsService.findAll();
  }

  @Post('')
  public createReview(@Body() newReview: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(newReview);
  }

  @Get('/:id')
  public getReview(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(Number(id));
  }

  @Put('/:id')
  public updateReview(@Param('id') id: string, @Body() updatedReview: UpdateReviewDto): Promise<Review> {
    return this.reviewsService.update(Number(id), updatedReview);
  }

  @Delete('/:id')
  public deleteReview(@Param('id') id: string): Promise<void> {
    return this.reviewsService.remove(Number(id));
  }
}
