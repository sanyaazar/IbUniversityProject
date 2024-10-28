import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddSecretKeyDbDTO } from './dto';
import { SecretKey } from '@prisma/client';

@Injectable()
export class PcKeyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addSecretKey(data: AddSecretKeyDbDTO): Promise<SecretKey> {
    const createdKey = await this.prisma.secretKey.create({
      data: {
        PcName: data.pcName,
        WmicUUID: data.WmicUUID,
      },
    });

    return createdKey;
  }

  async getPcByName(pcName: string): Promise<SecretKey | null> {
    const exist = await this.prisma.secretKey.findFirst({
      where: {
        PcName: pcName,
      },
    });

    return exist;
  }

  async getAllPc(): Promise<SecretKey[]> {
    return await this.prisma.secretKey.findMany();
  }
}
