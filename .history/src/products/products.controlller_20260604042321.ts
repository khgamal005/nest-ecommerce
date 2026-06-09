import { Body, Controller, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
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
  const product= this.products.find((p) => p.id === Number(id));
  if(!product) throw new NotFoundException(`Product with id ${id} not found`);
  return product;
}

@Put('api/products/:id')
public updateProduct(@Param('id') id: string, @Body() updatedProduct: Partial<Product>): Product | undefined {
  const productIndex = this.products.findIndex((p) => p.id === Number(id));
  if (productIndex === -1) {
    throw new NotFoundException(`Product with id ${id} not found`);
  }
  this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };
  return this.products[productIndex];
}
}

