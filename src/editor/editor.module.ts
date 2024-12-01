import { Module } from '@nestjs/common';
import { EditorController } from './editor.controller';
import { EditorService } from './editor.service';
import { UserRepository } from 'src/database/user.repository';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from './encryption.service';
import { FileRepository } from 'src/database/file.repository';
import { Hasher } from 'src/auth/hasher';

@Module({
  controllers: [EditorController],
  providers: [
    EditorService,
    UserRepository,
    ConfigService,
    EncryptionService,
    FileRepository,
    Hasher,
  ],
})
export class EditorModule {}
