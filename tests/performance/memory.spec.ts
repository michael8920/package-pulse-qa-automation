import { test, expect } from '@playwright/test';
import { getMemoryMetrics, calculateMemoryGrowth } from './utils/metrics';
import { HomePage } from '../../pages/HomePage';
import { PACKAGES } from '../../utils/constants';

test.describe('Memory tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('Memory usage during project selection', async ({ page }) => {
    await page.goto('/');
    const initialMetrics = await getMemoryMetrics(page);

    if (!initialMetrics.available) {
      test.skip(true, 'Memory metrics not available in this browser');
    }

    await homePage.searchBar.selectProject(PACKAGES.playwright);
    await page.waitForLoadState('networkidle');

    const finalMetrics = await getMemoryMetrics(page);

    const memoryGrowth = await calculateMemoryGrowth(initialMetrics.usedJSHeapSize, finalMetrics.usedJSHeapSize);

    expect(memoryGrowth).toBeLessThan(0.3);
  });
});
