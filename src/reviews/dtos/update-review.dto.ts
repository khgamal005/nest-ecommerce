import { IsString, IsNotEmpty, IsNumber, IsPositive, MinLength, Min, Max, IsOptional } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  userId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  comment?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  productId?: number;
}
