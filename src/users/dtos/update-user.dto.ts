import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;
}
