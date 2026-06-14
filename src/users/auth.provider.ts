import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtPayload } from 'src/utils/type';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

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

  private generateJwt(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
