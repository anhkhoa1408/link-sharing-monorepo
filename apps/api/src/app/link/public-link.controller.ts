import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LinkResponseDto } from './dto/link-response.dto';
import { LinkService } from './link.service';

@Controller('users/:userId/links')
export class PublicLinkController {
  constructor(private readonly links: LinkService) {}

  @Get()
  findAll(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<LinkResponseDto[]> {
    return this.links.findAll(userId);
  }
}
