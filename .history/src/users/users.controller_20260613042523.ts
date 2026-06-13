import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from 'src/utils/decorators/public.decorator';
import { UserRole } from 'src/utils/enums';
import { Roles } from './decorators/user-role.decorators';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  public findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Public()
  @Post('/auth/register')
  public createUser(@Body() newUser: CreateUserDto): Promise<{ accessToken: string }> {
    return this.usersService.register(newUser);
  }

  @Public()
  @use
  @Post('/auth/login')
  public async loginUser(@Body() credentials: LoginUserDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string }> {
    const { accessToken } = await this.usersService.login(credentials);
    res.header('Authorization', `Bearer ${accessToken}`);
    return { accessToken };
  }

  @Get('getCurrentUser')
  public getCurrentUser(@Headers('authorization') authorization: string): Promise<User> {
    const token = authorization?.replace('Bearer ', '');
    return this.usersService.getCurrentUser(token);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updatedUser: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updatedUser);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  public remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
