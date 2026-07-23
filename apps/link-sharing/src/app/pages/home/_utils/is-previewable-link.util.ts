import type { Platform } from '@link-sharing/shared-models';
import { PLATFORM_DOMAINS } from '../_constants/platform-domains.constant';

export function isPreviewableLink(
  platform: Platform | null,
  rawUrl: string,
): platform is Platform {
  if (platform === null) {
    return false;
  }

  try {
    const url = new URL(rawUrl);

    if (url.protocol !== 'https:') {
      return false;
    }

    const hostname = url.hostname.toLowerCase();

    return PLATFORM_DOMAINS[platform].some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}
