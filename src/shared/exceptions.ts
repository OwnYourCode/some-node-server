import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException {
  constructor() {
    super('Token is not valid', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidTokenTypeException extends HttpException {
  constructor() {
    super('Token type is invalid', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid credentials', HttpStatus.BAD_REQUEST);
  }
}
