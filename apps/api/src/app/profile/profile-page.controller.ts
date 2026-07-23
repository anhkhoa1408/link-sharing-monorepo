import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilePageResponseDto } from './dto/profile-page-response.dto';
import { ProfilePageService } from './profile-page.service';
import type { AuthenticatedRequest } from './types/profile.types';

@Controller('users/me/profile-page')
@UseGuards(JwtAuthGuard)
export class CurrentProfilePageController {
  constructor(private readonly profilePages: ProfilePageService) {}

  @Get()
  get(@Req() request: AuthenticatedRequest): Promise<ProfilePageResponseDto> {
    return this.profilePages.get(request.user.claims.sub);
  }
}

@Controller('users/:userId/profile-page')
export class PublicProfilePageController {
  constructor(private readonly profilePages: ProfilePageService) {}

  @Get()
  get(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<ProfilePageResponseDto> {
    return this.profilePages.get(userId);
  }
}
