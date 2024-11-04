import { HttpException, HttpStatus } from '@nestjs/common';

export class FailedCaptchaVerification extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid CAPTCHA. Please try again',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
