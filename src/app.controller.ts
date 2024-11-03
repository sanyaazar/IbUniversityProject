import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMainWindow(@Res() res: Response) {
    res.sendFile(
      'D:\\Универ\\university-ib-project\\src\\html-pages\\main-window.html',
    );
  }
}
