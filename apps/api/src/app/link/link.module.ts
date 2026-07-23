import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkRepository } from './link.repository';
import { LinkService } from './link.service';
import { PublicLinkController } from './public-link.controller';

@Module({
  controllers: [LinkController, PublicLinkController],
  providers: [LinkService, LinkRepository],
  exports: [LinkService],
})
export class LinkModule {}
