import { Body, Controller, Get, Post } from '@nestjs/common';

type Product = {
  id: number;
  name: string;
  price: number;
};

@Controller()
export class ProductsController {
  private products: Product[] = [
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

  @Get('api/products')
  public getAllProducts(): Product[] {
    return this.products;
  }

  @Post('api/products')
  public createProduct(@Body() newProduct: Product): Product {
    const createdProduct: Product = {
      id: this.products.length + 1,
      ...newProduct,
    };

    this.products.push(createdProduct);

    return createdProduct;
  }
}