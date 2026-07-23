import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import type { AuthenticatedRequest } from './types/profile.types';

@Controller('users/me/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profiles: ProfileService) {}

  @Get()
  get(@Req() request: AuthenticatedRequest): Promise<ProfileResponseDto> {
    return this.profiles.get(request.user.claims.sub);
  }

  @Put()
  update(
    @Req() request: AuthenticatedRequest,
    @Body() input: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profiles.update(request.user.claims.sub, input);
  }
}
