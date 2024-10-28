import { Module } from '@nestjs/common';
import { PcKeyService } from './pc-key.service';
import { PcKeyController } from './pc-key.controller';
import { Hasher } from 'src/auth/hasher';
import { PcKeyRepository } from 'src/database/pc-key.repository';

@Module({
  controllers: [PcKeyController],
  providers: [PcKeyService, Hasher, PcKeyRepository],
  exports: [PcKeyRepository, PcKeyService],
})
export class PcKeyModule {}
