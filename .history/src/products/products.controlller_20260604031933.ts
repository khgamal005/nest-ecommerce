import { Controller, Get } from '@nestjs/common';

@Controller()
export class ProductsController {
private products = []


  @Get('api/products')
  public getAllProducts(): {
    id: number;
    name: string;
    price: number;
  }[] {
    return 
  }
}
