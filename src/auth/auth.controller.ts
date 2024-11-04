// src/auth.controller.ts
import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { PcKeyService } from 'src/pc-key/pc-key.service';
import { LoginDTO, SignUpDTO } from './dto';
import * as path from 'path';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly pcKeyService: PcKeyService,
  ) {}

  @Get()
  getAuthConfirmationPage(@Res() res: Response) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'src',
      'html-pages',
      'menu.html',
    );
    res.sendFile(filePath);
  }

  @Get('login')
  async getLoginPage(@Res() res: Response) {
    const check = this.pcKeyService.isKeyChecked();
    if (check) {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'src',
        'html-pages',
        'login.html',
      );
      res.sendFile(filePath);
    } else {
      res.sendStatus(401);
    }
  }

  @Get('signup')
  async getSignUpPage(@Res() res: Response) {
    const check = this.pcKeyService.isKeyChecked();
    if (check) {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'src',
        'html-pages',
        'sign-up.html',
      );
      res.sendFile(filePath);
    } else {
      res.sendStatus(401);
    }
  }

  @Post('login')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    const response = await this.authService.login(body);

    return res.json(response);
  }

  @Post('signup')
  async signup(@Body() body: SignUpDTO, @Res() res: Response) {
    const response = await this.authService.signup(body);
    return res.json(response);
  }
}
