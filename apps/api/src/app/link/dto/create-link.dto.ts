import { IsEnum, IsUrl } from 'class-validator';
import { Platform } from '../../../generated/prisma/enums';

export class CreateLinkDto {
  @IsEnum(Platform)
  platform!: Platform;

  @IsUrl({ protocols: ['https'], require_protocol: true })
  url!: string;
}
