import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Hasher } from 'src/auth/hasher';
import { FileRepository } from 'src/database/file.repository';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly ivLength = 16;
  private encryptionKey: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly hasher: Hasher,
    private readonly fileRepository: FileRepository,
  ) {
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!this.encryptionKey) {
      throw new Error('Encryption key not defined in environment variables');
    }
  }

  /**
   * Шифрование содержимого файла.
   * @param fileName Имя файла для сохранения зашифрованного контента.
   * @param content Содержимое файла, которое нужно зашифровать.
   * @returns Путь к зашифрованному файлу.
   */
  async encryptFile(
    fileName: string,
    content: string,
    username: string,
  ): Promise<string> {
    const file = await this.fileRepository.getFile(fileName);

    const iv = crypto.randomBytes(this.ivLength); // Генерация случайного вектора инициализации
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey!, 'hex'),
      iv,
    );

    const encrypted = Buffer.concat([
      cipher.update(content, 'utf8'),
      cipher.final(),
    ]);

    // Формируем путь к зашифрованному файлу
    const encryptedFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      `${fileName.split('.')[0]}.enc`,
    );
    await fs.promises.writeFile(
      encryptedFilePath,
      Buffer.concat([iv, encrypted]),
    );

    const fileStats = fs.statSync(fileName);
    const modificationTime = fileStats.mtime.toISOString();
    const hashedFileTime = await this.hasher.hash(modificationTime);

    if (file) {
      await this.fileRepository.updateFileTimeHash(fileName, hashedFileTime);
    } else {
      await this.fileRepository.setFileRights(username, fileName);
      await this.fileRepository.addFile(fileName, hashedFileTime);
    }
    return encryptedFilePath;
  }

  /**
   * Дешифровка содержимого файла.
   * @param encryptedFilePath Путь к зашифрованному файлу.
   * @returns Расшифрованное содержимое файла.
   */
  async decryptFile(encryptedFilePath: string): Promise<string> {
    const encryptedContent: Buffer =
      await fs.promises.readFile(encryptedFilePath);

    // Извлекаем IV и зашифрованные данные
    const iv = Buffer.from(encryptedContent.subarray(0, this.ivLength));
    const encryptedData = Buffer.from(encryptedContent.subarray(this.ivLength)); // Используем subarray

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey!, 'hex'),
      iv,
    );

    // Дешифруем данные
    try {
      const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      throw new Error(
        'Warning: This file has been modified since the last save!',
      );
    }
  }
}
