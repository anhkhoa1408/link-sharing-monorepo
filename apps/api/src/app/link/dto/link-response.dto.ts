import { Platform } from '../../../generated/prisma/enums';

export class LinkResponseDto {
  id!: string;
  userId!: string;
  platform!: Platform;
  url!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
