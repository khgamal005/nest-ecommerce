import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/utils/enums';
import { ROLES_KEY } from '../decorators/user-role.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const controller = context.getClass();
    const request = context.switchToHttp().getRequest();

    const requiredRoles =
      this.reflector.get<UserRole[] | undefined>(ROLES_KEY, handler) ??
      this.reflector.get<UserRole[] | undefined>(ROLES_KEY, controller);

    if (!requiredRoles) {
      return true;
    }

    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
