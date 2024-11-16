import { Injectable } from '@nestjs/common';
import { RightType } from '@prisma/client';
import { UserRepository } from 'src/database/user.repository';
import { GetUserRightsOnFileDTO } from './dto';

@Injectable()
export class EditorService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserRightsOnFile(body: GetUserRightsOnFileDTO): Promise<RightType> {
    let userRights: RightType = RightType.READ;
    const user = await this.userRepository.getUserByLogin(body.username);

    if (user) {
      userRights =
        (await this.userRepository.getUserRightsOnFile(
          user.userId,
          body.filename,
        )) ?? userRights;
    }

    return userRights;
  }
}
