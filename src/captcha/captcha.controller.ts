import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { Response } from 'express';
import * as path from 'path';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get('page')
  getCaptchaVerificationPage(@Res() res: Response) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'src',
      'html-pages',
      'captcha-verification.html',
    );
    res.sendFile(filePath);
  }

  @Get('')
  async getCaptcha() {
    const captcha = this.captchaService.createCaptcha();
    return { image: captcha.image };
  }

  @Post('verify')
  verifyCaptcha(@Body('userInput') userInput: string) {
    const isValid = this.captchaService.verifyCaptcha(userInput);
    return { isValid };
  }
}
