export const AVATAR_FILE_FIELD = 'avatar';
export const AVATAR_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const AVATAR_SIGNED_URL_TTL_SECONDS = 60 * 60;
export const AVATAR_ALLOWED_MIME_TYPES =
  /^(image\/jpeg|image\/png|image\/webp)$/;

export const AVATAR_NOT_FOUND = 'Avatar not found';
export const AVATAR_FILE_TOO_LARGE = 'Avatar file must not exceed 5 MB';
export const AVATAR_MIME_TYPE_INVALID =
  'Avatar must be a JPEG, PNG, or WebP image';
export const AVATAR_STORAGE_UNAVAILABLE = 'Avatar storage unavailable';
