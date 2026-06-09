import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Product } from './products/product.entity';

@Module({
  imports: [
    ProductModule,
    UserModule,
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'khaled',
      password: '123456',
      database: 'ecommerce',
      synchronize: true,
      entities:[Product]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
