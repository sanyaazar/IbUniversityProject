import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Hasher } from 'src/auth/hasher';
import { FileRepository } from 'src/database/file.repository';
import { exec } from 'child_process'; // Импорт для выполнения команд в консоли
import * as os from 'os';
import { UserRepository } from 'src/database/user.repository';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly ivLength = 16;
  private encryptionKey: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly hasher: Hasher,
    private readonly fileRepository: FileRepository,
    private readonly userRepository: UserRepository,
  ) {
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!this.encryptionKey) {
      throw new Error('Encryption key not defined in environment variables');
    }
  }

  private lockFile(filePath: string): void {
    const escapedFilePath = `"${filePath.replace(/\\/g, '\\\\')}"`; // Экранируем путь с двойными слэшами
    const currentUsername = os.userInfo().username;

    const denyCommand = `icacls ${escapedFilePath} /inheritance:r /deny "${currentUsername}:(F)"`;

    exec(denyCommand, (err, stdout, stderr) => {
      if (err) {
        console.error(`Failed to lock file: ${stderr}`);
        return;
      }
      console.log(`File locked successfully for ${currentUsername}.`);
    });
  }

  public unlockFile(filePath: string): boolean {
    const escapedFilePath = `"${filePath.replace(/\\/g, '\\\\')}"`; // Экранируем путь с двойными слэшами
    const currentUsername = os.userInfo().username;
    console.log(currentUsername);
    const command = `icacls ${escapedFilePath} /inheritance:r /grant "${currentUsername}:(F)"`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`Failed to unlock file: ${stderr}`);
      }
      console.log('File unlocked successfully.');
    });
    const command1 = `icacls ${escapedFilePath} /inheritance:r /grant "DefaultAccount:(F)"`;
    exec(command1, (err, stdout, stderr) => {
      if (err) {
        console.error(`Failed to unlock file: ${stderr}`);
      }
      console.log('File unlocked successfully.');
    });
    return true;
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
    console.log(
      'fileName:  ' +
        fileName +
        '  content  ' +
        content +
        '   username   ' +
        username,
    );
    const encryptedFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      `${fileName.split('.')[0]}.enc`,
    );
    if (this.unlockFile(encryptedFilePath)) {
      let file = await this.fileRepository.getFile(fileName);
      const user = await this.userRepository.getUserByLogin(username);

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
      await fs.promises.writeFile(
        encryptedFilePath,
        Buffer.concat([iv, encrypted]),
      );

      const fileStats = fs.statSync(fileName);
      const modificationTime = fileStats.mtime.toISOString();
      const hashedFileTime = await this.hasher.hash(modificationTime);

      if (file) {
        await this.fileRepository.updateFileTimeHash(fileName, hashedFileTime);
        await this.fileRepository.updateFileOpenStatus(fileName, false);
      } else {
        await this.fileRepository.setFileRights(username, fileName);
        await this.fileRepository.addFile(fileName, hashedFileTime);
      }

      file = await this.fileRepository.getFile(fileName);
      await this.fileRepository.addSaveTimeFile(file!.fileId, user!.userId);
    }
    return encryptedFilePath;
  }

  /**
   * Дешифровка содержимого файла.
   * @param encryptedFilePath Путь к зашифрованному файлу.
   * @returns Расшифрованное содержимое файла.
   */
  async decryptFile(fileName: string): Promise<string> {
    // Формируем путь к зашифрованному файлу
    const encryptedFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      `${fileName.split('.')[0]}.enc`,
    );
    const encryptedContent: Buffer =
      await fs.promises.readFile(encryptedFilePath);

    this.lockFile(encryptedFilePath);

    // Извлекаем IV и зашифрованные данные
    const iv = Buffer.from(encryptedContent.subarray(0, this.ivLength));
    const encryptedData = Buffer.from(encryptedContent.subarray(this.ivLength)); // Используем subarray

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey!, 'hex'),
      iv,
    );

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
