import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedPrincipal } from '../auth/strategies/jwt.strategy';
import { CreateLinkDto } from './dto/create-link.dto';
import { LinkResponseDto } from './dto/link-response.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinkService } from './link.service';

interface AuthenticatedRequest {
  user: AuthenticatedPrincipal;
}

@Controller('users/me/links')
@UseGuards(JwtAuthGuard)
export class LinkController {
  constructor(private readonly links: LinkService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() input: CreateLinkDto,
  ): Promise<LinkResponseDto> {
    return this.links.create(request.user.claims.sub, input);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest): Promise<LinkResponseDto[]> {
    return this.links.findAll(request.user.claims.sub);
  }

  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<LinkResponseDto> {
    return this.links.findOne(request.user.claims.sub, id);
  }

  @Put(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateLinkDto,
  ): Promise<LinkResponseDto> {
    return this.links.update(request.user.claims.sub, id, input);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.links.remove(request.user.claims.sub, id);
  }
}
