import { Page } from '@playwright/test';

export async function getLoadMetrics(page: Page) {
  return await page.evaluate(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      ttfb: navigationEntry.responseStart,
      loadTime: navigationEntry.loadEventEnd,
      domContentLoaded: navigationEntry.domContentLoadedEventEnd,
      fcp: performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0
    };
  });
}
