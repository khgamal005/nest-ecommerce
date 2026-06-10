import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  public createUser(@Body() newUser: CreateUserDto): Promise<User> {
    return this.usersService.create(newUser);
  }

  @Get('/:id')
  public getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(Number(id));
  }

  @Put('/:id')
  public updateUser(@Param('id') id: string, @Body() updatedUser: UpdateUserDto): Promise<User> {
    return this.usersService.update(Number(id), updatedUser);
  }

  @Delete('/:id')
  public deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(Number(id));
  }
}
