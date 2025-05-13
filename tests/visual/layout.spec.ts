/**
 * Visual Regression Tests
 * Tests for validating consistent visual appearance of UI components
 */

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

  /**
   * Tests chart visual consistency
   * - Selects a project and verifies chart visibility
   * - Moves mouse to chart center
   * - Captures screenshot of chart
   * - Masks tooltip to prevent flaky comparisons
   *
   * @skip Firefox due to rendering differences
   */
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

  /**
   * Tests tooltip visual consistency
   * - Selects a project and verifies chart visibility
   * - Moves mouse to chart center to show tooltip
   * - Validates tooltip visibility and content
   * - Captures screenshot of tooltip
   *
   * @skip Firefox due to rendering differences
   */
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
