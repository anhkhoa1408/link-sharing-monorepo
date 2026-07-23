import type { Platform } from '@link-sharing/shared-models';

export const PLATFORM_HOSTS = {
  GITHUB: ['github.com'],
  FRONTEND_MENTOR: ['frontendmentor.io'],
  TWITTER: ['twitter.com', 'x.com'],
  LINKEDIN: ['linkedin.com'],
  YOUTUBE: ['youtube.com', 'youtu.be'],
  FACEBOOK: ['facebook.com', 'fb.com'],
  TWITCH: ['twitch.tv'],
  DEV_TO: ['dev.to'],
  CODEWARS: ['codewars.com'],
  CODEPEN: ['codepen.io'],
  FREE_CODE_CAMP: ['freecodecamp.org'],
  GITLAB: ['gitlab.com'],
  HASHNODE: ['hashnode.com'],
  STACK_OVERFLOW: ['stackoverflow.com'],
} satisfies Record<Platform, readonly string[]>;

export const INVALID_LINK_URL = 'URL must be HTTPS and match the platform';
export const LINK_NOT_FOUND = 'Link not found';
export const LINK_ALREADY_EXISTS = 'Link already exists';
