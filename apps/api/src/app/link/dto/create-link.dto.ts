import { PLATFORM_VALUES, type Platform } from '@link-sharing/shared-models';
import { IsIn, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsIn(PLATFORM_VALUES)
  platform!: Platform;

  @IsUrl({ protocols: ['https'], require_protocol: true })
  url!: string;
}
