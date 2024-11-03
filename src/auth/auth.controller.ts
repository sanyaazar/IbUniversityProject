// src/auth.controller.ts
import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { PcKeyService } from 'src/pc-key/pc-key.service';
import { LoginDTO, SignUpDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly pcKeyService: PcKeyService,
  ) {}

  @Get()
  getAuthConfirmationPage(@Res() res: Response) {
    res.sendFile(
      'D:\\Универ\\university-ib-project\\src\\html-pages\\menu.html',
    );
  }

  @Get('login')
  async getLoginPage(@Res() res: Response) {
    const check = this.pcKeyService.isKeyChecked();
    if (check)
      res.sendFile(
        'D:\\Универ\\university-ib-project\\src\\html-pages\\login.html',
      );
    else {
      res.sendStatus(401);
    }
  }

  @Get('signup')
  async getSignUpPage(@Res() res: Response) {
    const check = this.pcKeyService.isKeyChecked();
    if (check)
      res.sendFile(
        'D:\\Универ\\university-ib-project\\src\\html-pages\\sign-up.html',
      );
    else {
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
