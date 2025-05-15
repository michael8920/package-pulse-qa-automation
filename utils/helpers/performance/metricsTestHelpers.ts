import { Page } from '@playwright/test';

export async function getLoadMetrics(page: Page) {
  return await page.evaluate(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      ttfb: navigationEntry.responseStart,
      loadTime: navigationEntry.loadEventEnd,
      domContentLoaded: navigationEntry.domContentLoadedEventEnd,
      fcp:
        performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
    };
  });
}

export async function getMemoryMetrics(page: Page) {
  const memory = await page.evaluate(() => {
    const memoryInfo = (performance as any).memory;

    if (!memoryInfo) {
      return {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
        available: false,
      };
    }

    return {
      usedJSHeapSize: memoryInfo.usedJSHeapSize,
      totalJSHeapSize: memoryInfo.totalJSHeapSize,
      jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
      available: true,
    };
  });

  return {
    ...memory,
    usedJSHeapSizeMB: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
    totalJSHeapSizeMB: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
    jsHeapSizeLimitMB: Math.round(memory.jsHeapSizeLimit / (1024 * 1024)),
  };
}

export async function calculateMemoryGrowth(initial: number, final: number) {
  return (final - initial) / initial;
}
