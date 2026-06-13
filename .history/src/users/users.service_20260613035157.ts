import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtPayload } from 'src/utils/type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
    const existing = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    let newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });

    newUser = await this.userRepository.save(newUser);
    const payload: JwtPayload = { id: newUser.id, email: newUser.email, role: newUser.role };
    const accessToken = await this.generateJwt(payload);

    return { accessToken };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email: loginUserDto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = await this.generateJwt(payload);
    return { accessToken };
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

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.remove(user);
  }

  private generateJwt(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}