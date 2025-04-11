import { test, expect } from '@playwright/test';
import { TAGS } from '../../utils/constants';
import { HomePage } from '../../pages/HomePage';
import { TimePeriod } from '../../pages/components/PackageCard';

test.describe('Project analysis flow tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto('/');
    homePage = new HomePage(page);
    await page.waitForLoadState('domcontentloaded');
  });

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

  test('Time period can be successfully changed to 6 months', { tag: TAGS.BUGGED }, async ({ page }) => {
    await homePage.searchBar.selectProject('react');

    await expect(homePage.packageCard.isTimePeriodVisible()).resolves.toBeTruthy();
    const initialPeriod = await homePage.packageCard.getTimePeriodOption();

    await homePage.packageCard.changeTimePeriod(TimePeriod.SIX_MONTHS);

    const xAxisValues = await homePage.packageCard.getChartAxisValues('x');

    expect(await homePage.packageCard.getTimePeriodOption()).not.toBe(initialPeriod);
    expect(await homePage.packageCard.getTimePeriodOption()).toBe(TimePeriod.SIX_MONTHS);

    const sixMonthsRange = await homePage.packageCard.areDatesInMonthRange('6 months');
    expect(sixMonthsRange).toBeTruthy();
  });
});
