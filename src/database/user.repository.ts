import { Injectable } from '@nestjs/common';
import { RightType, User } from '@prisma/client';
import { SignUpDTO } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: SignUpDTO): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        login: user.username,
        password: user.password,
        name: user.fullName,
        phoneNumber: user.phone,
        email: user.email,
        address: user.address,
      },
    });

    return createdUser;
  }

  async getUserByLogin(userLogin: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        login: userLogin,
      },
    });
    return user || null;
  }

  async getUserByEmail(userEmail: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    return user || null;
  }

  async getUserByPhoneNumber(userPhoneNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        phoneNumber: userPhoneNumber,
      },
    });
    return user || null;
  }

  async getUserRightsOnFile(
    userId: string,
    filename: string,
  ): Promise<RightType | null> {
    const fileRight = await this.prisma.fileRight.findFirst({
      where: {
        userId,
        FileName: filename,
      },
      select: {
        rights: {
          select: {
            right: true,
          },
        },
      },
    });

    return fileRight?.rights?.right || null;
  }
}
