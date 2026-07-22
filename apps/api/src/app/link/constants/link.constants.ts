import { Platform } from '../../../generated/prisma/enums';

export const PLATFORM_HOSTS = {
  [Platform.GITHUB]: ['github.com'],
  [Platform.FRONTEND_MENTOR]: ['frontendmentor.io'],
  [Platform.TWITTER]: ['twitter.com', 'x.com'],
  [Platform.LINKEDIN]: ['linkedin.com'],
  [Platform.YOUTUBE]: ['youtube.com', 'youtu.be'],
  [Platform.FACEBOOK]: ['facebook.com', 'fb.com'],
  [Platform.TWITCH]: ['twitch.tv'],
  [Platform.DEV_TO]: ['dev.to'],
  [Platform.CODEWARS]: ['codewars.com'],
  [Platform.FREE_CODE_CAMP]: ['freecodecamp.org'],
  [Platform.GITLAB]: ['gitlab.com'],
  [Platform.HASHNODE]: ['hashnode.com'],
  [Platform.STACK_OVERFLOW]: ['stackoverflow.com'],
} satisfies Record<Platform, readonly string[]>;

export const INVALID_LINK_URL = 'URL must be HTTPS and match the platform';
export const LINK_NOT_FOUND = 'Link not found';
export const LINK_ALREADY_EXISTS = 'Link already exists';
