import type { Platform } from '@link-sharing/shared-models';

export const PLATFORM_DOMAINS = {
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
} satisfies Readonly<Record<Platform, readonly string[]>>;
