import { ConflictException, Injectable } from '@nestjs/common';

import { Hasher } from './hasher';
import { AuthRepository } from 'src/database';
import { PcKeyService } from 'src/pc-key/pc-key.service';
import { LoginDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hasher: Hasher,
    private readonly authRepository: AuthRepository,
    private readonly pcKeyService: PcKeyService,
  ) {}

  async login(body: LoginDTO) {
    return this.pcKeyService.isKeyChecked();
  }
}
