import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from 'src/utils/enums';
import { Roles } from 'src/users/decorators/user-role.decorators';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { JwtPayload } from 'src/utils/type';
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

  @UseGuards(AuthGuard)
  @Post('')
  public createReview(@Body() newReview: CreateReviewDto, @Req() request: Request): Promise<Review> {
    const userId = (request.user as JwtPayload).id;
    return this.reviewsService.create(newReview, userId);
  }

  @Get('/:id')
  public getReview(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(Number(id));
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  public updateReview(@Param('id') id: string, @Body() updatedReview: UpdateReviewDto, @Req() request: Request): Promise<Review> {
    const user = request.user as JwtPayload;
    return this.reviewsService.update(Number(id), updatedReview, user.id, user.role);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  public deleteReview(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const user = request.user as JwtPayload;
    return this.reviewsService.remove(Number(id), user.id, user.role);
  }
}
