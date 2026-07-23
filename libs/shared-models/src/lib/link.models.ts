export const PLATFORM_VALUES = [
  'GITHUB',
  'FRONTEND_MENTOR',
  'TWITTER',
  'LINKEDIN',
  'YOUTUBE',
  'FACEBOOK',
  'TWITCH',
  'DEV_TO',
  'CODEWARS',
  'CODEPEN',
  'FREE_CODE_CAMP',
  'GITLAB',
  'HASHNODE',
  'STACK_OVERFLOW',
] as const;

export type Platform = (typeof PLATFORM_VALUES)[number];

export interface UserLink {
  readonly id: string;
  readonly platform: Platform;
  readonly url: string;
}

export interface SaveLink {
  readonly platform: Platform;
  readonly url: string;
}
