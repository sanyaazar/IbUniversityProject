import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import * as path from 'path';
import { Response } from 'express';
import { GetUserRightsOnFileDTO } from './dto';
import { EditorService } from './editor.service';
import { EncryptionService } from './encryption.service';

@Controller('editor')
export class EditorController {
  constructor(
    private readonly editorService: EditorService,
    private readonly encryptionService: EncryptionService,
  ) {}

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

  @Post('file')
  async getUserRightsOnFile(
    @Body() body: GetUserRightsOnFileDTO,
    @Res() res: Response,
  ) {
    try {
      const response = await this.editorService.getUserRightsOnFile(body);
      return res.json(response);
    } catch (error) {
      return res.json({
        error: {
          message: error.message,
        },
      });
    }
  }

  @Post('encrypt')
  async encrypt(
    @Body() body: { fileName: string; content: string; username: string },
  ) {
    try {
      const encryptedFilePath = await this.encryptionService.encryptFile(
        body.fileName,
        body.content,
        body.username,
      );

      return { message: 'File encrypted successfully', encryptedFilePath };
    } catch (error) {
      throw new Error('Encryption failed: ' + error);
    }
  }

  @Post('close-file')
  async closeFile(@Body() body: { fileName: string }, @Res() res: Response) {
    const response = await this.editorService.closeFile(body.fileName);
    return res.json(response);
  }
}
