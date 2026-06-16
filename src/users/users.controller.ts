import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request, Response } from 'express';
import { Public } from 'src/utils/decorators/public.decorator';
import { UserRole } from 'src/utils/enums';
import { JwtPayload } from 'src/utils/type';
import { Roles } from './decorators/user-role.decorators';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)

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
  @Get('verify-email')
  public async verifyEmail(@Query('token') token: string): Promise<{ message: string }> {
    return this.usersService.verifyEmail(token);
  }

  @Public()
  @Post('/auth/login')
  public async loginUser(@Body() credentials: LoginUserDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string }> {
    const { accessToken } = await this.usersService.login(credentials);
    res.header('Authorization', `Bearer ${accessToken}`);
    return { accessToken };
  }

  @Public()
  @Post('forgot-password')
  public async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.usersService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  public async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    return this.usersService.resetPassword(dto.token, dto.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('getCurrentUser')
  public getCurrentUser(@Headers('authorization') authorization: string): Promise<User> {
    const token = authorization?.replace('Bearer ', '');
    return this.usersService.getCurrentUser(token);
  }

  @UseGuards(AuthGuard)
  @Post('profile/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', 'users');
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, 'profile-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  public uploadProfileImage(@Req() request: Request, @UploadedFile() file: Express.Multer.File): Promise<User> {
    const userId = (request.user as JwtPayload).id;
    const imageUrl = `/uploads/users/${file.filename}`;
    return this.usersService.updateProfileImage(userId, imageUrl);
  }

  @UseGuards(AuthGuard)
  @Delete('profile/image')
  public removeProfileImage(@Req() request: Request): Promise<User> {
    const userId = (request.user as JwtPayload).id;
    return this.usersService.removeProfileImage(userId);
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
