import type { Platform } from '@link-sharing/shared-models';
import { PLATFORM_HOSTS } from '../constants/link.constants';
import { InvalidLinkUrlError } from '../errors/link.errors';

export function validateAndNormalizeLinkUrl(
  platform: Platform,
  value: string,
): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new InvalidLinkUrlError();
  }

  const hostname = url.hostname.toLowerCase();
  const matchesPlatform = PLATFORM_HOSTS[platform].some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );

  if (url.protocol !== 'https:' || !matchesPlatform) {
    throw new InvalidLinkUrlError();
  }

  return url.toString();
}
