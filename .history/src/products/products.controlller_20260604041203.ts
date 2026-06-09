import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';

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
  public createProduct(@Body() newProduct: CreateProductDto): CreateProductDto {
    const createdProduct: Product = {
      ...newProduct,
      id: this.products.length + 1,
    };

    this.products.push(createdProduct);

    return createdProduct;
  }

@Get('api/products/:id')
public getProduct(@Param('id') id: string): Product | undefined {
  return this.products.find((p) => p.id === Number(id));
  if()
}
}
