import { Controller, Get } from '@nestjs/common';

@Controller()
export class ReviewsController {
  @Get('')
  findAll(): {
    id: number;
    user: string;
    rating: number;
    comment: string;
  }[] {
    return [
      {
        id: 1,
        user: 'John Doe',
        rating: 5,
        comment: 'Excellent product! Highly recommended.',
      },
      {
        id: 2,
        user: 'Sarah Smith',
        rating: 4,
        comment: 'Good quality and fast delivery.',
      },
      {
        id: 3,
        user: 'Michael Brown',
        rating: 3,
        comment: 'Average experience, product was okay.',
      },
    ];
  }
}
