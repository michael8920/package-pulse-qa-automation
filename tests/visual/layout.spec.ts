import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { PackageCardElement } from '../../pages/components/PackageCard';
import { prepareForVisualTest } from '../../utils/visualTestHelpers';

test.describe('Visual Regression Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await page.goto('/');
    await prepareForVisualTest(page);
  });

  test('Chart layout remains consistent', async ({ page, browserName }) => {
    await homePage.searchBar.selectProject('react');
    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();

    await page.waitForTimeout(1000);
    await homePage.packageCard.moveToChartCenter();

    const chartElement = await homePage.packageCard.getElement(PackageCardElement.CHART);
    const tooltipElement = await homePage.packageCard.getElement(PackageCardElement.TOOLTIP);

    await expect(chartElement).toHaveScreenshot(`chart-default-${browserName}-${process.platform}.png`, {
      mask: [tooltipElement],
      animations: 'disabled',
      timeout: 5000,
    });
  });

  test('Tooltip visual appearance remains consistent', async ({ page, browserName }) => {
    await homePage.searchBar.selectProject('react');

    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();
    await homePage.packageCard.moveToChartCenter();

    const tooltipElement = await homePage.packageCard.getElement(PackageCardElement.TOOLTIP);

    await expect(tooltipElement).toBeVisible();
    await expect(tooltipElement).not.toBeEmpty();

    await expect(tooltipElement).toHaveScreenshot(`tooltip-default-${browserName}-${process.platform}.png`, {
      animations: 'disabled',
      timeout: 5000,
    });
  });
});
