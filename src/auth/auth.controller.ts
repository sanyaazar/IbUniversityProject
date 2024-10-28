// src/auth.controller.ts
import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginDTO } from './dto/login-body.dto';

@Controller('auth')
export class AuthController {
  @Get()
  getAuthConfirmationPage(@Res() res: Response) {
    res.sendFile(
      'D:\\Универ\\university-ib-project\\src\\html-pages\\menu.html',
    );
  }

  @Post('login')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    const { username, password } = body;

    console.log('Username:', username);
    console.log('Password:', password);

    return res.json({ message: 'Login successful', username });
  }
}
