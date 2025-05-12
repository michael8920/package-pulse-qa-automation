import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { performanceBudgets } from '../../utils/constants/performance/budgets';
import { getAssetSize, isOversized, isStaticAsset } from '../../utils/helpers/performance/assetsTestHelpers';

test.describe('Network tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

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
