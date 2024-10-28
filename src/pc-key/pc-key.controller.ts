import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { PcKeyService } from './pc-key.service';
import { Response } from 'express';
import { AddSecretKeyDTO, CheckSecretKeyDTO } from './dto';

@Controller('pc-key')
export class PcKeyController {
  constructor(private readonly pcKeyService: PcKeyService) {}

  @Get('checkSecretKey')
  async checkSecretKey(@Res() res: Response) {
    const response = await this.pcKeyService.checkSecretKey();
    return res.json(response);
  }

  @Post('addSecretKey')
  async addSecretKey(@Body() body: AddSecretKeyDTO, @Res() res: Response) {
    const response = await this.pcKeyService.addSecretKey(body);
    return res.json(response);
  }
}
