import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtPayload } from 'src/utils/type';
import { AuthProvider } from './auth.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly authProvider: AuthProvider,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getCurrentUser(bearerToken: string): Promise<User> {
    const payload = this.jwtService.verify<JwtPayload>(bearerToken);
    const user = await this.userRepository.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new NotFoundException(`User with id ${payload.id} not found`);
    }
    return user;
  }
  async register(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    return this.authProvider.register(createUserDto);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authProvider.login(loginUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepository.update(id, updateUserDto);
    return { ...user, ...updateUserDto } as User;
  }

  async updateProfileImage(userId: number, imageUrl: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    user.profileImage = imageUrl;
    return await this.userRepository.save(user);
  }

  async removeProfileImage(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    if (user.profileImage) {
      const filePath = join(process.cwd(), 'uploads', 'users', user.profileImage.replace('/uploads/users/', ''));
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }
    user.profileImage = null;
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.remove(user);
  }
}