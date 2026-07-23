import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AvatarService } from '../avatar/avatar.service';
import { LinkService } from '../link/link.service';
import { ProfilePageResponseDto } from './dto/profile-page-response.dto';
import { ProfileService } from './profile.service';

const PROFILE_PAGE_NOT_FOUND = 'Profile page not found';

@Injectable()
export class ProfilePageService {
  constructor(
    private readonly auth: AuthService,
    private readonly avatars: AvatarService,
    private readonly links: LinkService,
    private readonly profiles: ProfileService,
  ) {}

  async get(userId: string): Promise<ProfilePageResponseDto> {
    const [user, avatar, links, profile] = await Promise.all([
      this.auth.getById(userId),
      this.avatars.getOptional(userId),
      this.links.findAll(userId),
      this.profiles.findOptional(userId),
    ]);
    const email = user.email;

    if (!email) {
      throw new NotFoundException(PROFILE_PAGE_NOT_FOUND);
    }

    const savedName = [profile?.firstName, profile?.lastName]
      .filter((part): part is string => Boolean(part?.trim()))
      .join(' ')
      .trim();

    return {
      userId,
      displayName: savedName || email.split('@')[0] || email,
      email,
      avatarUrl: avatar?.avatarUrl ?? null,
      links: links.map(({ id, platform, url }) => ({ id, platform, url })),
    };
  }
}
