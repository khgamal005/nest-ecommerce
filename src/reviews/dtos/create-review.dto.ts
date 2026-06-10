import { IsString, IsNotEmpty, IsNumber, IsPositive, MinLength, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsPositive()
  userId: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  comment: string;

  @IsNumber()
  @IsPositive()
  productId: number;
}
