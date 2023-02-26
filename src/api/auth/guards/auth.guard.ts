import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../shared/decorators/anonymous.decorator';
import { DIMSLoggerService } from '../../../logger/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private readonly loggerService: DIMSLoggerService) {
    super();
  }

  handleRequest(error: any, user: any, info: any, context: any, status?: any) {
    this.loggerService.logMessage('JwtAuthGuard handleRequest error', error);
    this.loggerService.logMessage('JwtAuthGuard handleRequest user', user);
    this.loggerService.logMessage('JwtAuthGuard handleRequest info', info);
    this.loggerService.logMessage('JwtAuthGuard handleRequest status', status);

    if (error || !user) {
      throw error || new UnauthorizedException();
    }

    return user;
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.loggerService.logMessage('JwtAuthGuard isPublic', isPublic);

    if (isPublic) {
      return true;
    }

    return <boolean>super.canActivate(context);
  }
}
