import { Injectable } from '@nestjs/common';
import { RightType } from '@prisma/client';
import { UserRepository } from 'src/database/user.repository';
import { GetFileWithRightsResponseDTO, GetUserRightsOnFileDTO } from './dto';
import { EncryptionService } from './encryption.service';
import * as fs from 'fs';
import { Hasher } from 'src/auth/hasher';
import { FileRepository } from 'src/database/file.repository';
import * as path from 'path';

@Injectable()
export class EditorService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly hasher: Hasher,
    private readonly fileRepository: FileRepository,
  ) {}

  async closeFile(filename: string) {
    console.log('iasd asdas');
    this.fileRepository.updateFileOpenStatus(filename, false);
    const encryptedFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      `${filename.split('.')[0]}.enc`,
    );
    this.encryptionService.unlockFile(encryptedFilePath);
  }

  async getUserRightsOnFile(
    body: GetUserRightsOnFileDTO,
  ): Promise<GetFileWithRightsResponseDTO> {
    let userRights: RightType = RightType.NONE;
    let decryptedContent = '';
    let fileModifiedHash;

    const user = await this.userRepository.getUserByLogin(body.username);
    const file = await this.fileRepository.getFile(body.filename);
    if (file && file.fileOpen === true) {
      throw new Error('File already open in another window');
    }
    if (user) {
      userRights =
        (await this.userRepository.getUserRightsOnFile(
          user.userId,
          body.filename,
        )) ?? userRights;

      if (!file) {
        decryptedContent = await fs.promises.readFile(body.filename, 'utf-8');
        return {
          decryptedContent,
          rights: RightType.READ_WRITE_COPY,
          hashMismatch: false,
        };
      }

      if (userRights !== RightType.NONE) {
        decryptedContent = await this.decryptFile(body.filename);
      }

      const fileStats = fs.statSync(body.filename);
      const modificationTime = fileStats.mtime.toISOString();

      const hashedTime = await this.fileRepository.getFileTimeHash(
        body.filename,
      );

      fileModifiedHash = await this.hasher.compare(
        modificationTime,
        hashedTime!,
      );

      if (fileModifiedHash) {
        await this.fileRepository.updateFileOpenStatus(body.filename, true);
      }
    }

    return {
      decryptedContent,
      rights: userRights,
      hashMismatch: !fileModifiedHash,
    };
  }

  private async decryptFile(filePath: string): Promise<string> {
    return this.encryptionService.decryptFile(filePath);
  }
}
