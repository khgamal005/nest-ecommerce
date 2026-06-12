import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, ValidationPipe } from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('/auth/register')
  public createUser(@Body() newUser: CreateUserDto): Promise<{ accessToken: string }> {
    return this.usersService.register(newUser);
  }

  @Post('/auth/login')
  public async loginUser(@Body() credentials: LoginUserDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string }> {
    const { accessToken } = await this.usersService.login(credentials);
    res.header('Authorization', `Bearer ${accessToken}`);
    return { accessToken };
  }

  @Get('getCurrentUser')
  public getCurrentUser(@h('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getCurrentUser(id);
  }

  @Put('getCurrentUser')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updatedUser: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updatedUser);
  }

  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
