/**
 * Network Performance Tests
 * Tests for validating static asset loading and size constraints
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { performanceBudgets } from '../../utils/constants/performance/budgets';
import { getAssetSize, isOversized, isStaticAsset } from '../../utils/helpers/performance/assetsTestHelpers';

test.describe('Network tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  /**
   * Tests static asset loading and size constraints
   * - Monitors all network responses
   * - Validates static assets load successfully
   * - Checks asset sizes against performance budgets
   * - Tracks failed requests and oversized assets
   *
   * Validates:
   * - All static assets return allowed status codes
   * - No assets exceedd maximum size limit
   */
  test('All static assets load successfully and are under size limits', async ({ page }) => {
    const failedRequests: string[] = [];
    const oversizedAssets: { url: string; size: number }[] = [];

    page.on('response', async (response) => {
      const url = response.url();
      if (isStaticAsset(url)) {
        if (!performanceBudgets.resources.allowedStatusCodes.includes(response.status())) {
          failedRequests.push(`${url} (status: ${response.status()})`);
        }
        const size = getAssetSize(response);
        if (isOversized(size, performanceBudgets.resources.maxAssetSize)) {
          oversizedAssets.push({ url, size: size! });
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedRequests).toEqual([]);
    expect(oversizedAssets).toEqual([]);
  });
});
