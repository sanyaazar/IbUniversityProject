import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Hasher } from './hasher';
import { AuthRepository } from 'src/database';
import { PcKeyModule } from 'src/pc-key/pc-key.module';

@Module({
  imports: [PcKeyModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, Hasher],
})
export class AuthModule {}
