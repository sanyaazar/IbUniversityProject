import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyAttemptsException extends HttpException {
  constructor() {
    super(
      {
        message: 'Too many login attempts. Please try again later.',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
