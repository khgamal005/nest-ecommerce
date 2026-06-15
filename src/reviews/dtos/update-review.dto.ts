import { IsString, IsNotEmpty, IsNumber, IsPositive, Min, Max, MinLength, IsOptional } from 'class-validator';

export class UpdateReviewDto {
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
}
