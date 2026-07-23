import { Injectable } from '@nestjs/common';
import type { Profile } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { ProfileData } from './types/profile.types';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  upsert(userId: string, data: ProfileData): Promise<Profile> {
    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}
