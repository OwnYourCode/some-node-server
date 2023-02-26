import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserProfileService } from '../user-profile/service/user-profile.service';
import { JwtPayload } from './jwt.payload';
import { DIMSLoggerService } from '../../logger/logger.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userProfileService: UserProfileService,
    private readonly loggerService: DIMSLoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userProfileService.getById(payload.userId.toString());

    this.loggerService.logMessage('JwtStrategy payload', payload);
    this.loggerService.logMessage('JwtStrategy validate', user);

    if (user) {
      return user;
    }

    throw new UnauthorizedException();
  }
}
