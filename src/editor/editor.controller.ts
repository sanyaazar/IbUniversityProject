import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import * as path from 'path';
import { Response } from 'express';
import { GetUserRightsOnFileDTO } from './dto';
import { EditorService } from './editor.service';

@Controller('editor')
export class EditorController {
  constructor(private readonly editorService: EditorService) {}

  @Get('page')
  getCaptchaVerificationPage(@Res() res: Response) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'src',
      'html-pages',
      'editor.html',
    );
    res.sendFile(filePath);
  }

  @Post('user-rights')
  async getUserRightsOnFile(
    @Body() body: GetUserRightsOnFileDTO,
    @Res() res: Response,
  ) {
    const response = await this.editorService.getUserRightsOnFile(body);
    return res.json(response);
  }
}
