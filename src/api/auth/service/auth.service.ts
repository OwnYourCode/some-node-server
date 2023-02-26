import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { InvalidCredentialsException } from '../../../shared/exceptions';
import { ConfigService } from '@nestjs/config';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserProfileDto } from '../../user-profile/dto/user-profile.dto';

type AuthUserDto = Omit<UserProfileDto, 'password' | 'directionName'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly jwtService: JwtService,
    private readonly loggerService: DIMSLoggerService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser({ email, password }: UserLoginDto): Promise<AuthUserDto> {
    try {
      const existedUser = await this.userProfileService.getByEmail(email);

      const isValidPassword = await compare(password, existedUser.password);

      this.loggerService.logMessage('user password', password);
      this.loggerService.logMessage('existedUser password', existedUser.password);
      this.loggerService.logMessage('isValidPassword', isValidPassword);

      if (!isValidPassword) {
        throw new InvalidCredentialsException();
      }

      if (isValidPassword) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...restUser } = existedUser;

        return restUser;
      }
    } catch (error) {
      throw new InvalidCredentialsException();
    }
  }

  async createLoginResponse(loginUser: UserLoginDto) {
    const { email, id } = await this.validateUser(loginUser);

    const token = this.jwtService.sign(
      { email, userId: id },
      { expiresIn: this.configService.get('JWT_EXPIRATION_TIME') },
    );

    this.loggerService.logMessage('token', token);

    return {
      token,
    };
  }

  currentUser(authorizationHeader: string) {
    const token = authorizationHeader?.split(' ')[1];

    if (!this.jwtService.verify(token)) {
      throw new HttpException(`Expired token`, HttpStatus.UNAUTHORIZED);
    }

    return this.jwtService.decode(token);
  }
}
