import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from 'src/utils/enums';
import { Roles } from 'src/users/decorators/user-role.decorators';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { JwtPayload } from 'src/utils/type';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { QueryProductDto } from './dtos/query-product.dto';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('')
  public createProduct(@Body() newProduct: CreateProductDto, @Req() request: Request): Promise<Product> {
    const userId = (request.user as JwtPayload).id;
    return this.productsService.create(newProduct, userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('/:id')
  public updateProduct(@Param('id') id: string, @Body() updatedProduct: UpdateProductDto): Promise<Product> {
    return this.productsService.update(Number(id), updatedProduct);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  public deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(Number(id));
  }

  @Get('')
  public getAllProducts(@Query() query: QueryProductDto): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    return this.productsService.findAll(query);
  }

  @Get('/:id')
  public getProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }
}



