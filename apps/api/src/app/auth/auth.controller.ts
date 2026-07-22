import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedPrincipal } from './strategies/jwt.strategy';

interface AuthenticatedRequest {
  user: AuthenticatedPrincipal;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body() credentials: AuthCredentialsDto,
  ): Promise<RegisterResponseDto> {
    return this.auth.register(credentials);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() credentials: AuthCredentialsDto): Promise<LoginResponseDto> {
    return this.auth.login(credentials);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthenticatedRequest): Promise<User> {
    return this.auth.getCurrentUser(request.user.accessToken);
  }
}
