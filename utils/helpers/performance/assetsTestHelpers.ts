/**
 * Performance Test Helpers
 * Utility functions for testing assets sizes and types
 */

import { Response } from '@playwright/test';

/**
 * Gets the size of an asset from its response headers
 * @returns Size in bytes or null if not available
 */
export function getAssetSize(response: Response): number | null {
  const size = response.headers()['content-length'];
  return size ? Number(size) : null;
}

/**
 * Checks if a URL points to a static asset
 * @returns True if the URL ends with common static asset extensions
 */
export function isStaticAsset(url: string): boolean {
  return /\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$/i.test(url);
}

/**
 * Checks if an asset exceeds the maximum allowed size
 * @returns True if the asset size is greater than the maximum
 */
export function isOversized(size: number | null, maxSize: number): boolean {
  return size !== null && size > maxSize;
}
