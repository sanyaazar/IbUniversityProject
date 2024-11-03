import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Hasher } from './hasher';
import { AuthRepository } from 'src/database';
import { PcKeyService } from 'src/pc-key/pc-key.service';
import { LoginDTO, SignUpDTO } from './dto';
import { UserRepository } from 'src/database/user.repository';

@Injectable()
export class AuthService {
  private failedAttempts = 0;

  constructor(
    private readonly hasher: Hasher,
    private readonly authRepository: AuthRepository,
    private readonly pcKeyService: PcKeyService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(body: LoginDTO): Promise<boolean | number> {
    const isKeyChecked = this.pcKeyService.isKeyChecked();
    if (!isKeyChecked) return false;

    const existedUser = await this.userRepository.getUserByLogin(body.username);
    if (!existedUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (!(body.password === existedUser.password)) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return true;
  }

  async signup(body: SignUpDTO): Promise<boolean> {
    const isKeyChecked = this.pcKeyService.isKeyChecked();
    if (!isKeyChecked) return false;

    await this.checkUniqueFields(body);
    const createdUser = await this.userRepository.createUser(body);
    return createdUser ? true : false;
  }

  private async checkUniqueFields(input: SignUpDTO): Promise<void> {
    await this.checkLoginIsUnique(input.username);
    await this.checkEmailIsUnique(input.email);
    await this.checkPhoneIsUnique(input.phone);
  }

  private async checkLoginIsUnique(login: string): Promise<void> {
    const existing = await this.userRepository.getUserByLogin(login);
    if (existing) {
      throw new ConflictException(`User with such login already exists`);
    }
  }

  private async checkEmailIsUnique(email: string): Promise<void> {
    const existing = await this.userRepository.getUserByEmail(email);
    if (existing) {
      throw new ConflictException(`User with such email already exists`);
    }
  }

  private async checkPhoneIsUnique(tel: string): Promise<void> {
    const existing = await this.userRepository.getUserByPhoneNumber(tel);
    if (existing) {
      throw new ConflictException(`User with such phone number already exists`);
    }
  }

  getFailedAttempts(): number {
    return this.failedAttempts;
  }
}
