import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthProvider } from './auth.provider';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any },
      }),
    }),
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthProvider, AuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UserModule {}
