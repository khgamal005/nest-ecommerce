import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
  imports: [
    TypeOrmModule.forFeature([Review, User, Product]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
      }),
    }),
  ],
})
export class ReviewsModule {}
