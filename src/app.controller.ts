import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMainWindow(@Res() res: Response) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'html-pages',
      'main-window.html',
    );
    res.sendFile(filePath);
  }
}
