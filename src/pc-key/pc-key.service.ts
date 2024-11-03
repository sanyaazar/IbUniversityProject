import { ConflictException, Injectable } from '@nestjs/common';
import { SecretKey } from '@prisma/client';

import { Hasher } from 'src/auth/hasher';
import { PcKeyRepository } from 'src/database/pc-key.repository';
import { AddSecretKeyDTO } from './dto';
import { getWmicUUID } from 'getuuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PcKeyService {
  private pcKeyChecked: boolean = false;

  constructor(
    private readonly pcKeyRepository: PcKeyRepository,
    private readonly hasher: Hasher,
    private readonly configService: ConfigService,
  ) {}

  isKeyChecked(): boolean {
    return this.pcKeyChecked;
  }

  resetKeyCheck() {
    this.pcKeyChecked = false;
  }

  async addSecretKey(body: AddSecretKeyDTO): Promise<SecretKey> {
    const pcAlreadyExist = await this.pcKeyRepository.getPcByName(body.pcName);
    if (pcAlreadyExist)
      throw new ConflictException('PC with this name already exist');
    const hashedWmicUuid = await this.hasher.hash(body.WmicUUID);
    const createdKey = await this.pcKeyRepository.addSecretKey({
      pcName: body.pcName,
      WmicUUID: hashedWmicUuid,
    });

    return createdKey;
  }

  async checkSecretKey() {
    const wmicUuid: string = await getWmicUUID();
    this.resetKeyCheck();
    const pcValidKey = this.configService.get<string>('secretKey');
    if (pcValidKey === wmicUuid) this.pcKeyChecked = true;
    return this.isKeyChecked();
  }

  async checkPcValid(WmicUUID: string): Promise<string | null> {
    const existedPcs = await this.pcKeyRepository.getAllPc();
    for (const pc of existedPcs) {
      if (await this.hasher.compare(WmicUUID, pc.WmicUUID)) {
        return pc.PcName;
      }
    }
    return null;
  }
}
