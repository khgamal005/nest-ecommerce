import  

@Controller('reviews')
export class ReviewsController {
  @Get()
  findAll(): string {
    return 'This action returns all reviews';
  }
}
