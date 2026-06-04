import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get('/api/products')
  public getAllProducts(): {
    id: number;
    name: string;
    price: number;
  }[] {
    return [
      {
        id: 1,
        name: 'iPhone 15',
        price: 999,
      },
      {
        id: 2,
        name: 'Samsung Galaxy S25',
        price: 899,
      },
      {
        id: 3,
        name: 'Google Pixel 10',
        price: 799,
      },
    ];
  }
}
