import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { DIMSLoggerService } from '../../logger/logger.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly loggerService: DIMSLoggerService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.loggerService.logMessage('requiredRoles', requiredRoles);

    if (!requiredRoles?.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    this.loggerService.logMessage('user from context.switchToHttp().getRequest()', user);
    this.loggerService.logMessage('user from context.switchToHttp().getRequest() roles', user.roles);

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
