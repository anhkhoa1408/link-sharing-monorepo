import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '../../generated/prisma/client';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileRepository } from './profile.repository';

const PROFILE_NOT_FOUND = 'Profile not found';

@Injectable()
export class ProfileService {
  constructor(private readonly profiles: ProfileRepository) {}

  async get(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.profiles.findByUserId(userId);

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    return this.toResponse(profile);
  }

  async update(
    userId: string,
    input: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profiles.upsert(userId, input);

    return this.toResponse(profile);
  }

  private toResponse(profile: Profile): ProfileResponseDto {
    return {
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
