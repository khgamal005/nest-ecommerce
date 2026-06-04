import { Module } from '@nestjs/common';
import { ProductsController } from './products.controlller';

@Module({
  controllers: [ProductsController],
})
export class ProductModule {}
