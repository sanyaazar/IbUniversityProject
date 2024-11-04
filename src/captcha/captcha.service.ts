import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import * as svgCaptcha from 'svg-captcha';
import { FailedCaptchaVerification } from './errors/FailedCaptchaVerification';
import { CreateCaptchaResponseDTO } from './dto';

@Injectable()
export class CaptchaService {
  constructor(private readonly authService: AuthService) {}

  private generatedCaptchaText: string;

  createCaptcha(): CreateCaptchaResponseDTO {
    const captcha = svgCaptcha.create({ size: 6, noise: 3 });
    this.generatedCaptchaText = captcha.text;
    return { image: captcha.data, text: captcha.text };
  }

  verifyCaptcha(userInput: string): boolean {
    const isVerified = userInput === this.generatedCaptchaText;
    if (!isVerified) throw new FailedCaptchaVerification();
    this.authService.resetFailedAttempts();
    return isVerified;
  }
}
