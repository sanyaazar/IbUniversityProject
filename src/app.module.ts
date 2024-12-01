import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PcKeyModule } from './pc-key/pc-key.module';
import { ConfigModule } from '@nestjs/config';
import { CaptchaModule } from './captcha/captcha.module';
import { EditorModule } from './editor/editor.module';
import { EncryptionService } from './editor/encryption.service';
import { Hasher } from './auth/hasher';
import { FileRepository } from './database/file.repository';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    PcKeyModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CaptchaModule,
    EditorModule,
  ],
  controllers: [AppController],
  providers: [AppService, EncryptionService, Hasher, FileRepository],
})
export class AppModule {}
