import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PcKeyModule } from './pc-key/pc-key.module';

@Module({
  imports: [AuthModule, PrismaModule, PcKeyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
