import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Hasher } from './hasher';
import { AuthRepository } from 'src/database';
import { PcKeyModule } from 'src/pc-key/pc-key.module';
import { UserRepository } from 'src/database/user.repository';

@Module({
  imports: [PcKeyModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, Hasher, UserRepository],
  exports: [AuthService],
})
export class AuthModule {}
