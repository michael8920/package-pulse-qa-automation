import { Response } from '@playwright/test';

export function getAssetSize(response: Response): number | null {
  const size = response.headers()['content-length'];
  return size ? Number(size) : null;
}

export function isStaticAsset(url: string): boolean {
  return /\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$/i.test(url);
}

export function isOversized(size: number | null, maxSize: number): boolean {
  return size !== null && size > maxSize;
}
