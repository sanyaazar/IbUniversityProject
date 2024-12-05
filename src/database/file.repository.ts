import { Injectable } from '@nestjs/common';
import { File } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFileTimeHash(fileName: string): Promise<string | undefined> {
    const file = await this.prisma.file.findFirst({
      where: {
        fileName,
      },
    });

    return file?.fileHash;
  }

  async addFile(fileName: string, fileHash: string) {
    const file = await this.prisma.file.create({
      data: {
        fileName,
        fileHash,
      },
    });

    return file;
  }

  async getFile(fileName: string): Promise<File | null> {
    return await this.prisma.file.findFirst({
      where: {
        fileName,
      },
    });
  }

  async updateFileTimeHash(fileName: string, fileTimeHash: string) {
    return await this.prisma.file.update({
      where: {
        fileName,
      },
      data: {
        fileHash: fileTimeHash,
      },
    });
  }

  async setFileRights(username: string, fileName: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        login: username,
      },
    });

    await this.prisma.fileRight.create({
      data: {
        FileName: fileName,
        rightId: 3,
        userId: user!.userId,
      },
    });
  }

  async updateFileOpenStatus(filename: string, status: boolean) {
    await this.prisma.file.update({
      where: {
        fileName: filename,
      },
      data: {
        fileOpen: status,
      },
    });
  }

  async addSaveTimeFile(
    fileId: string,
    userId: string,
    action: string = 'edit',
  ) {
    await this.prisma.fileHistory.create({
      data: {
        fileId,
        userId,
        action,
      },
    });
  }

  async getLastFileUser(fileId: string): Promise<string> {
    const fileHistoryLine = await this.prisma.fileHistory.findFirst({
      where: {
        fileId,
        action: 'edit',
      },
      orderBy: {
        updatedDate: 'desc',
      },
    });

    return fileHistoryLine!.userId;
  }
}
