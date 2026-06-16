import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtPayload } from 'src/utils/type';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const existing = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    let newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      verificationToken,
    });

    newUser = await this.userRepository.save(newUser);

    await this.mailService.sendTemplateMail(
      newUser.email,
      'Verify Your Email',
      'verify-email',
      {
        name: newUser.name,
        verificationUrl: `http://localhost:5000/api/users/verify-email?token=${verificationToken}`,
        year: new Date().getFullYear(),
      },
    );

    const payload: JwtPayload = { id: newUser.id, email: newUser.email, role: newUser.role };
    const accessToken = await this.generateJwt(payload);

    return { accessToken };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email: loginUserDto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isAccountVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = await this.generateJwt(payload);

    await this.mailService.sendTemplateMail(
      user.email,
      'Login Notification',
      'login',
      { name: user.name, time: new Date().toLocaleString(), year: new Date().getFullYear() },
    );

    return { accessToken };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { verificationToken: token } });
    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
    user.isAccountVerified = true;
    user.verificationToken = null;
    await this.userRepository.save(user);
    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent' };
    }
    const token = randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3_600_000);
    await this.userRepository.save(user);

    await this.mailService.sendTemplateMail(
      user.email,
      'Password Reset Request',
      'forgot-password',
      {
        name: user.name,
        resetUrl: `http://localhost:5000/api/users/reset-password?token=${token}`,
        year: new Date().getFullYear(),
      },
    );

    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    await this.mailService.sendTemplateMail(
      user.email,
      'Password Reset Confirmation',
      'reset-password',
      { name: user.name, year: new Date().getFullYear() },
    );

    return { message: 'Password reset successfully' };
  }

  private generateJwt(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
