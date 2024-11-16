import { Module } from '@nestjs/common';
import { EditorController } from './editor.controller';
import { EditorService } from './editor.service';
import { UserRepository } from 'src/database/user.repository';

@Module({
  controllers: [EditorController],
  providers: [EditorService, UserRepository],
})
export class EditorModule {}
