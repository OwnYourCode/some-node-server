import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiBadRequestResponse, ApiHeaders, ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Anonymous } from '../../../shared/decorators/anonymous.decorator';
import { LoginResponse } from '../dto/login.response.dto';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { UserLoginDto } from '../dto/user-login.dto';

export class MeResponse {
  @ApiProperty({
    example: 'senior.junior@gmail.com',
  })
  email: string;
  @ApiProperty({
    example: '7a1c8cda-370a-4803-a6d5-d751bde035c8',
  })
  userId: string;
}

@ApiTags('auth')
@Anonymous()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly loggerService: DIMSLoggerService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  @ApiOkResponse({
    description: 'User was successfully logged in',
    type: [LoginResponse],
  })
  async login(@Body() loginUser: UserLoginDto): Promise<LoginResponse> {
    this.loggerService.logMessage('loginUser', loginUser);

    return this.authService.createLoginResponse(loginUser);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get current user token info',
    description: 'Returns current user token info',
  })
  @ApiOkResponse({
    description: 'Current user token info successfully returned',
    type: [MeResponse],
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiHeaders([{ name: 'Authorization' }])
  async me(@Headers('authorization') authorizationHeader) {
    this.loggerService.logMessage('authorizationHeader', authorizationHeader);

    return this.authService.currentUser(authorizationHeader);
  }
}
