import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/utils/type';




@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
  
  
canActivate(context: ExecutionContext) {
  const request = context.switchToHttp().getRequest();
  const [type, token] = request.headers.authorization?.split('') || [];
  if (type == 'Bearer' && token) {
        const payload = this.jwtService.verify<JwtPayload>(token);
        request.user = payload;
        return true;
    }
  return false;
}
}
