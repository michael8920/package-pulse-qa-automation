/**
 * Performance Metrics Helpers
 * Utility functions for measuring page load and memory performance
 */

import { Page } from '@playwright/test';

/**
 * Gets page load performance
 * @returns Object containing TTFB, load time, DOM content loaded time, and FCP
 */
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

/**
 * Gets JavaScript memory usage metrics
 * @returns Object containing heap sizes in bytes and megabytes
 */
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

/**
 * Calculates memory growth percentage
 * @returns Growth percentage between initial and final memory values
 */
export async function calculateMemoryGrowth(initial: number, final: number) {
  return (final - initial) / initial;
}
