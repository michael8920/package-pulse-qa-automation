import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { PackageCardElement } from '../../pages/components/PackageCard';
import { prepareForVisualTest } from '../../utils/helpers/visual/visualTestHelpers';
import { TIMEOUTS } from '../../utils/constants';

test.describe('Layout visual regression tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await page.goto('/');
    await prepareForVisualTest(page);
  });

  test('Chart layout remains consistent', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Skipping Firefox due to rendering differences');

    await homePage.searchBar.selectProject('react');
    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();

    await page.waitForTimeout(TIMEOUTS.EXTRA_FAST);
    await homePage.packageCard.moveToChartCenter();

    const chartElement = await homePage.packageCard.getElement(PackageCardElement.CHART);
    const tooltipElement = await homePage.packageCard.getElement(PackageCardElement.TOOLTIP);

    await expect(chartElement).toHaveScreenshot(`chart-default.png`, {
      mask: [tooltipElement],
      animations: 'disabled',
      timeout: TIMEOUTS.FAST,
    });
  });

  test('Tooltip visual appearance remains consistent', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Skipping Firefox due to rendering differences');

    await homePage.searchBar.selectProject('react');

    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();
    await homePage.packageCard.moveToChartCenter();

    const tooltipElement = await homePage.packageCard.getElement(PackageCardElement.TOOLTIP);

    await expect(tooltipElement).toBeVisible();
    await expect(tooltipElement).not.toBeEmpty();

    await expect(tooltipElement).toHaveScreenshot(`tooltip-default.png`, {
      animations: 'disabled',
      timeout: TIMEOUTS.FAST,
    });
  });
});
