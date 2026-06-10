import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;
}
