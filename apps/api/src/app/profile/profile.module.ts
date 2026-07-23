import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AvatarModule } from '../avatar/avatar.module';
import { LinkModule } from '../link/link.module';
import {
  CurrentProfilePageController,
  PublicProfilePageController,
} from './profile-page.controller';
import { ProfilePageService } from './profile-page.service';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

@Module({
  imports: [AuthModule, AvatarModule, LinkModule],
  controllers: [
    CurrentProfilePageController,
    ProfileController,
    PublicProfilePageController,
  ],
  providers: [ProfilePageService, ProfileService, ProfileRepository],
})
export class ProfileModule {}
