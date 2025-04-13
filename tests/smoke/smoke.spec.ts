import { test, expect } from '@playwright/test';
import { TAGS } from '../../utils/constants';
import { HomePage } from '../../pages/HomePage';

test.describe('Smoke tests', { tag: TAGS.SMOKE }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    await page.goto('/');
    homePage = new HomePage(page);
    await page.waitForLoadState('domcontentloaded');
  });

  test('Theme can be changed successfully', async ({ page }) => {
    const initialTheme = await homePage.header.getCurrentTheme();
    expect(initialTheme).toBe('light');

    await homePage.header.selectTheme('Dark');
    const darkTheme = await homePage.header.getCurrentTheme();
    expect(darkTheme).toBe('dark');

    await homePage.header.selectTheme('Light');
    const lightTheme = await homePage.header.getCurrentTheme();
    expect(lightTheme).toBe('light');
  });

  test('Searching for project can be performed successfully', async ({ page }) => {
    await homePage.searchBar.selectProject('test');

    await page.waitForURL('**/?projects=test');

    const currentUrl = await homePage.getCurrentUrl();
    expect(currentUrl).toBe(`https://www.package-pulse.com/?projects=test`);

    expect(await homePage.packageCard.isTimePeriodVisible()).toBeTruthy();
    expect(await homePage.packageCard.isChartVisible()).toBeTruthy();
    expect(await homePage.packageCard.isInfoButtonVisible()).toBeTruthy();
    expect(await homePage.packageCard.isStatsButtonVisible()).toBeTruthy();
    expect(await homePage.packageCard.isTableVisible()).toBeTruthy();
  });
});
