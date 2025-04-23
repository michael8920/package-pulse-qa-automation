import { test, expect } from '@playwright/test';
import { getLoadMetrics } from './utils/metrics';
import { performanceBudgets } from './config/budgets';
import { HomePage } from '../../pages/HomePage';
import { PACKAGES } from '../../utils/constants';

test.describe('Runtime Performance', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('Rapid project addition performance', async ({ page }) => {
    await page.goto('/');

    await homePage.searchBar.selectProject(PACKAGES.react);
    await page.waitForLoadState('networkidle');
    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();
    const baselineMetrics = await getLoadMetrics(page);

    await page.click('body', { position: { x: 0, y: 0 } });

    await homePage.searchBar.selectProject(PACKAGES.playwright);
    await page.waitForLoadState('networkidle');
    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();
    await expect(page).toHaveURL(/projects=react.*playwright/);
    const additionMetrics = await getLoadMetrics(page);

    expect(additionMetrics.ttfb).toBeLessThan(performanceBudgets.timing.ttfb);
    expect(additionMetrics.loadTime).toBeLessThan(performanceBudgets.timing.tti);
    expect(additionMetrics.loadTime).toBeLessThan(baselineMetrics.loadTime * 1.2);
  });
});
