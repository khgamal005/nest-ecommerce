import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  public getAllProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post('')
  public createProduct(@Body() newProduct: CreateProductDto): Promise<Product> {
    return this.productsService.create(newProduct);
  }

  @Get('/:id')
  public getProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }

  @Put('/:id')
  public updateProduct(@Param('id') id: string, @Body() updatedProduct: UpdateProductDto): Promise<Product> {
    return this.productsService.update(Number(id), updatedProduct);
  }

  @Delete('/:id')
  public deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(Number(id));
  }
}



