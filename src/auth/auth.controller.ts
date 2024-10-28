// src/auth.controller.ts
import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginDTO } from './dto/login-body.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuthConfirmationPage(@Res() res: Response) {
    res.sendFile(
      'D:\\Универ\\university-ib-project\\src\\html-pages\\menu.html',
    );
  }

  @Post('login')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    const response = await this.authService.login(body);

    return res.json(response);
  }
}
