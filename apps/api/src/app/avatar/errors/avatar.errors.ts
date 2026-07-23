import { AVATAR_STORAGE_UNAVAILABLE } from '../constants/avatar.constants';

export class AvatarStorageError extends Error {
  constructor() {
    super(AVATAR_STORAGE_UNAVAILABLE);
    this.name = AvatarStorageError.name;
  }
}
