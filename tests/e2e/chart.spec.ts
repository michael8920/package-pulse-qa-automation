/**
 * Chart Functionality Tests
 * Tests for package statistics chart interactions and time period controls
 */

import { test, expect } from '@playwright/test';
import { TAGS, TIMEOUTS } from '../../utils/constants';
import { HomePage } from '../../pages/HomePage';
import { TimePeriod } from '../../pages/components/PackageCard';
import { timeStamp } from 'console';

test.describe('Project analysis flow tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(TIMEOUTS.EXTRA_SLOW);
    await page.goto('/');
    homePage = new HomePage(page);
    await page.waitForLoadState('domcontentloaded');
  });

  /**
   * Tests time period selection functionality
   * - Verifies time period selector is visible
   * - Changes period to 1 year
   * - Validates date range is correct
   */
  test('Time period can be changed successfully', async ({ page }) => {
    await homePage.searchBar.selectProject('react');

    await expect(homePage.packageCard.isTimePeriodVisible()).resolves.toBeTruthy();
    const initialPeriod = await homePage.packageCard.getTimePeriodOption();

    await homePage.packageCard.changeTimePeriod(TimePeriod.ONE_YEAR);

    expect(await homePage.packageCard.getTimePeriodOption()).not.toBe(initialPeriod);
    expect(await homePage.packageCard.getTimePeriodOption()).toBe(TimePeriod.ONE_YEAR);

    const oneYearRange = await homePage.packageCard.areDatesInYearRange('1 year');
    expect(oneYearRange).toBeTruthy();

    const fiveYearRange = await homePage.packageCard.areDatesInYearRange('5 years');
    expect(fiveYearRange).toBeFalsy();
  });

  /**
   * Tests 6-month time period selection
   * - Verifies period change to 6 months
   * - Validates date range is correct
   * - Checks compatibility with year range
   * @bugged Known issue with 6-month period
   */
  test('Time period can be successfully changed to 6 months', { tag: TAGS.BUGGED }, async ({ page }) => {
    await homePage.searchBar.selectProject('react');

    await expect(homePage.packageCard.isTimePeriodVisible()).resolves.toBeTruthy();
    const initialPeriod = await homePage.packageCard.getTimePeriodOption();

    await homePage.packageCard.changeTimePeriod(TimePeriod.SIX_MONTHS);

    expect(await homePage.packageCard.getTimePeriodOption()).not.toBe(initialPeriod);
    expect(await homePage.packageCard.getTimePeriodOption()).toBe(TimePeriod.SIX_MONTHS);

    const sixMonthsRange = await homePage.packageCard.areDatesInMonthRange('6 months');
    expect(sixMonthsRange).toBeTruthy();

    const oneYearRange = await homePage.packageCard.areDatesInYearRange('1 year');
    expect(oneYearRange).toBeTruthy();
  });

  /**
   * Tests 5-year time period selection
   * - Verifies period change to 5 years
   * - Validates date range is correct
   */
  test('Time period can be successfully changed to 5 years', async ({ page }) => {
    await homePage.searchBar.selectProject('react');

    await expect(homePage.packageCard.isTimePeriodVisible()).resolves.toBeTruthy();
    const initialPeriod = await homePage.packageCard.getTimePeriodOption();

    await homePage.packageCard.changeTimePeriod(TimePeriod.FIVE_YEARS);

    expect(await homePage.packageCard.getTimePeriodOption()).not.toBe(initialPeriod);
    expect(await homePage.packageCard.getTimePeriodOption()).toBe(TimePeriod.FIVE_YEARS);

    const fiveYearsRange = await homePage.packageCard.areDatesInYearRange('5 years');
    expect(fiveYearsRange).toBeTruthy();
  });

  /**
   * Tests chart tooltip functionality
   * - Verifies tooltip appears on hover
   * - Validates tooltip content (package name, downloads, date)
   */
  test('Details pop up shows correct information on chart mouse hover', async ({ page }) => {
    await homePage.searchBar.selectProject('react');
    await page.waitForTimeout(TIMEOUTS.FAST);
    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();

    await page.mouse.move(0, 0);
    await expect(homePage.packageCard.isTooltipVisible()).resolves.toBeFalsy();

    await homePage.packageCard.moveToChartCenter();
    await expect(homePage.packageCard.isTooltipVisible()).resolves.toBeTruthy();

    const details = await homePage.packageCard.getTooltipDetails();

    expect(details.packageName).toBe('react');
    expect(details.downloads).toBeGreaterThanOrEqual(0);
    expect(homePage.packageCard.isValidDateFormat(details.date)).toBeTruthy();
  });

  /**
   * Tests chart tooltip updates on mouse movement
   * - Verifies tooltip updates with mouse position
   * - Validates date progression
   * - Checks data consistency across positions
   */
  test('Details pop up correctly updates information on mouse position change', async ({ page }) => {
    await homePage.searchBar.selectProject('react');
    await page.waitForTimeout(TIMEOUTS.FAST);
    await expect(homePage.packageCard.isChartVisible()).resolves.toBeTruthy();

    await homePage.packageCard.moveToChartCenter();
    await expect(homePage.packageCard.isTooltipVisible()).resolves.toBeTruthy();
    const initialDetails = await homePage.packageCard.getTooltipDetails();

    await homePage.packageCard.moveMouseOnChart(40, 0);
    await expect(homePage.packageCard.isTooltipVisible()).resolves.toBeTruthy();
    const newestDetails = await homePage.packageCard.getTooltipDetails();

    expect(homePage.packageCard.parseDate(newestDetails.date).getTime()).toBeGreaterThan(
      homePage.packageCard.parseDate(initialDetails.date).getTime(),
    );
    expect(newestDetails.packageName).toBe(initialDetails.packageName);
    expect(newestDetails.downloads).toBeGreaterThanOrEqual(0);

    await homePage.packageCard.moveMouseOnChart(-80, 0);
    await expect(homePage.packageCard.isTooltipVisible()).resolves.toBeTruthy();
    const oldestDetails = await homePage.packageCard.getTooltipDetails();

    expect(homePage.packageCard.parseDate(oldestDetails.date).getTime()).toBeLessThan(
      homePage.packageCard.parseDate(newestDetails.date).getTime(),
    );
    expect(homePage.packageCard.parseDate(oldestDetails.date).getTime()).toBeLessThan(
      homePage.packageCard.parseDate(initialDetails.date).getTime(),
    );
    expect(oldestDetails.packageName).toBe(initialDetails.packageName);
    expect(oldestDetails.downloads).toBeGreaterThanOrEqual(0);
  });
});
