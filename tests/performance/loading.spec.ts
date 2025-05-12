import { test, expect } from '@playwright/test';
import { getLoadMetrics } from '../../utils/helpers/performance/metricsTestHelpers';
import { performanceBudgets } from '../../utils/constants/performance/budgets';
import { HomePage } from '../../pages/HomePage';
import { PACKAGES } from '../../utils/constants';

test.use({ browserName: 'chromium' });

test.describe('Page Load Performance', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('Homepage meets performance budgets', async ({ page }) => {
    await page.goto('/');

    const metrics = await getLoadMetrics(page);

    expect(metrics.ttfb).toBeLessThan(performanceBudgets.timing.ttfb);
    expect(metrics.loadTime).toBeLessThan(performanceBudgets.timing.tti);
    expect(metrics.fcp).toBeLessThan(performanceBudgets.timing.fcp);
    expect(metrics.domContentLoaded).toBeLessThan(performanceBudgets.timing.lcp);
  });

  test('Page with project details meets performance budgets', async ({ page }) => {
    await page.goto('/');

    await homePage.searchBar.selectProject(PACKAGES.react);
    await page.waitForLoadState('networkidle');

    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();
    await expect(homePage.packageCard.isTableVisible()).resolves.toBeTruthy();

    const metrics = await getLoadMetrics(page);

    expect(metrics.ttfb).toBeLessThan(performanceBudgets.timing.ttfb);
    expect(metrics.loadTime).toBeLessThan(performanceBudgets.timing.tti);
    expect(metrics.fcp).toBeLessThan(performanceBudgets.timing.fcp);
    expect(metrics.domContentLoaded).toBeLessThan(performanceBudgets.timing.lcp);
  });

  test('Page with two project details meets performance budgets', async ({ page }) => {
    await page.goto('/');
    await homePage.searchBar.selectProject(PACKAGES.react);
    await page.waitForLoadState('networkidle');
    await page.click('body', { position: { x: 0, y: 0 } });

    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();
    await expect(homePage.packageCard.isTableVisible()).resolves.toBeTruthy();

    await homePage.searchBar.selectProject(PACKAGES.vue);
    await page.waitForLoadState('networkidle');

    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();
    await expect(homePage.packageCard.isTableVisible()).resolves.toBeTruthy();

    const multiProjectMetrics = await getLoadMetrics(page);

    expect(multiProjectMetrics.ttfb).toBeLessThan(performanceBudgets.timing.ttfb);
    expect(multiProjectMetrics.loadTime).toBeLessThan(performanceBudgets.timing.tti);
    expect(multiProjectMetrics.fcp).toBeLessThan(performanceBudgets.timing.fcp);
    expect(multiProjectMetrics.domContentLoaded).toBeLessThan(performanceBudgets.timing.lcp);
  });
});
