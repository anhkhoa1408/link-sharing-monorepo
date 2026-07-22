import { AVATAR_STORAGE_UNAVAILABLE } from './avatar.constants';

export class AvatarStorageError extends Error {
  constructor() {
    super(AVATAR_STORAGE_UNAVAILABLE);
    this.name = AvatarStorageError.name;
  }
}
