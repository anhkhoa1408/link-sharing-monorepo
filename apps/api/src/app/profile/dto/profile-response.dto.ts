import type { Profile } from '@link-sharing/shared-models';

export class ProfileResponseDto implements Profile {
  id!: string;
  userId!: string;
  firstName!: string;
  lastName!: string;
  createdAt!: string;
  updatedAt!: string;
}
