import { Module } from '@nestjs/common';
import { AvatarController } from './avatar.controller';
import { AvatarRepository } from './avatar.repository';
import { AvatarService } from './avatar.service';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService, AvatarRepository],
  exports: [AvatarService],
})
export class AvatarModule {}
