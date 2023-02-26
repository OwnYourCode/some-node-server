import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controller/auth.controller';
import { DIMSLoggerService } from '../../logger/logger.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserProfileModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  providers: [AuthService, DIMSLoggerService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
