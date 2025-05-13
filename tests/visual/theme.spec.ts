/**
 * Theme Visual Regression Tests
 * Tests for validating consistent visual appearance across light and dark themes
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { HeaderElement } from '../../pages/components/Header';
import { prepareForVisualTest } from '../../utils/helpers/visual/visualTestHelpers';
import { FooterElement } from '../../pages/components/Footer';
import { SearchBarElement } from '../../pages/components/SearchBar';
import { PackageCardElement } from '../../pages/components/PackageCard';
import { TIMEOUTS } from '../../utils/constants';

test.describe('Theme visual regression tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await page.goto('/');
    await prepareForVisualTest(page);
  });

  test.describe('Light theme tests', () => {
    /**
     * Tests header appearance in light theme
     * - Sets theme to light mode
     * - Verifies theme is applied correctly
     * - Validates header visibility and content
     * - Captures screenshot for visual regression
     */
    test('Header looks correctly in light mode', async ({ page }) => {
      await homePage.header.selectTheme('Light');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('light');

      const headerContainer = await homePage.header.getElement(HeaderElement.CONTAINER);

      await expect(homePage.header.isHeaderVisible()).resolves.toBeTruthy();
      await expect(headerContainer).not.toBeEmpty();

      await expect(headerContainer).toHaveScreenshot('header-light-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
      });
    });

    /**
     * Tests search bar appearance in light theme
     * - Sets theme to light mode
     * - Verifies theme is applied correctly
     * - Tests both landing page and home page states
     * - Validates search bar visibility and content
     * - Captures screenshots for both states
     */
    test('Search bar looks correctly in light mode', async ({ page }) => {
      await homePage.header.selectTheme('Light');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('light');

      const searchBarContainer = await homePage.searchBar.getElement(SearchBarElement.CONTAINER);

      await expect(homePage.searchBar.isSearchBarVisible()).resolves.toBeTruthy();
      await expect(searchBarContainer).not.toBeEmpty();

      await expect(searchBarContainer).toHaveScreenshot('search-bar-landing-light-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
      });

      await homePage.searchBar.selectProject('react');
      await expect(homePage.searchBar.isSearchBarVisible()).resolves.toBeTruthy();

      await expect(searchBarContainer).not.toBeEmpty();
      await expect(searchBarContainer).toHaveScreenshot('search-bar-home-light-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
      });
    });

    /**
     * Tests table appearance in light theme
     * - Sets theme to light mode
     * - Verifies theme is applied correctly
     * - Loads project data
     * - Validates table visibility and content
     * - Masks dynamic content (values and arrows)
     * - Captures screenshot for visual regression
     */
    test('Table looks correctly in light mode', async ({ page }) => {
      await homePage.header.selectTheme('Light');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('light');

      await homePage.searchBar.selectProject('react');
      await expect(homePage.packageCard.isTableVisible()).resolves.toBeTruthy();

      const tableContainer = await homePage.packageCard.getElement(PackageCardElement.TABLE);
      const tableValues = await homePage.packageCard.getTableValueLocators();
      const tableArrows = await homePage.packageCard.getTableArrowLocators();

      await expect(tableContainer).not.toBeEmpty();
      await expect(tableContainer).toHaveScreenshot('table-light-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
        mask: [...tableValues, ...tableArrows],
      });
    });

    /**
     * Tests footer appearance in light theme
     * - Sets theme to light mode
     * - Verifies theme is applied correctly
     * - Validates footer visibility and content
     * - Captures screenshot for visual regression
     */
    test('Footer looks correctly in light mode', async ({ page }) => {
      await homePage.header.selectTheme('Light');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('light');

      const footerContainer = await homePage.footer.getElement(FooterElement.CONTAINER);

      await expect(homePage.footer.isFooterVisible()).resolves.toBeTruthy();
      await expect(footerContainer).not.toBeEmpty();

      await expect(footerContainer).toHaveScreenshot('footer-light-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
      });
    });
  });

  test.describe('Dark theme tests', () => {
    /**
     * Tests header appearance in dark theme
     * - Sets theme to dark mode
     * - Verifies theme is applied correctly
     * - Validates header visibility and content
     * - Captures screenshot for visual regression
     */
    test('Header looks correctly in dark mode', async ({ page }) => {
      await homePage.header.selectTheme('Dark');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('dark');

      const headerContainer = await homePage.header.getElement(HeaderElement.CONTAINER);

      await expect(homePage.header.isHeaderVisible()).resolves.toBeTruthy();
      await expect(headerContainer).not.toBeEmpty();

      await expect(headerContainer).toHaveScreenshot('header-dark-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
      });
    });

    /**
     * Tests search bar appearance in dark theme
     * - Sets theme to dark mode
     * - Verifies theme is applied correctly
     * - Tests both landing page and home page states
     * - Validates search bar visibility and content
     * - Captures screenshots for both states
     */
    test('Search bar looks correctly in dark mode', async ({ page }) => {
      await homePage.header.selectTheme('Dark');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('dark');

      const searchBarContainer = await homePage.searchBar.getElement(SearchBarElement.CONTAINER);

      await expect(homePage.searchBar.isSearchBarVisible()).resolves.toBeTruthy();
      await expect(searchBarContainer).not.toBeEmpty();

      await expect(searchBarContainer).toHaveScreenshot('search-bar-landing-dark-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
      });

      await homePage.searchBar.selectProject('react');
      await expect(homePage.searchBar.isSearchBarVisible()).resolves.toBeTruthy();

      await expect(searchBarContainer).not.toBeEmpty();
      await expect(searchBarContainer).toHaveScreenshot('search-bar-home-dark-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
      });
    });

    /**
     * Tests table appearance in dark theme
     * - Sets theme to dark mode
     * - Verifies theme is applied correctly
     * - Loads project data
     * - Validates table visibility and content
     * - Masks dynamic content (values and arrows)
     * - Captures screenshot for visual regression
     */
    test('Table looks correctly in dark mode', async ({ page }) => {
      await homePage.header.selectTheme('Dark');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('dark');

      await homePage.searchBar.selectProject('react');
      await expect(homePage.packageCard.isTableVisible()).resolves.toBeTruthy();

      const tableContainer = await homePage.packageCard.getElement(PackageCardElement.TABLE);
      const tableValues = await homePage.packageCard.getTableValueLocators();
      const tableArrows = await homePage.packageCard.getTableArrowLocators();

      await expect(tableContainer).not.toBeEmpty();
      await expect(tableContainer).toHaveScreenshot('table-dark-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
        mask: [...tableValues, ...tableArrows],
      });
    });

    /**
     * Tests footer appearance in dark theme
     * - Sets theme to dark mode
     * - Verifies theme is applied correctly
     * - Validates footer visibility and content
     * - Captures screenshot for visual regression
     */
    test('Footer looks correctly in dark mode', async ({ page }) => {
      await homePage.header.selectTheme('Dark');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('dark');

      const footerContainer = await homePage.footer.getElement(FooterElement.CONTAINER);

      await expect(homePage.footer.isFooterVisible()).resolves.toBeTruthy();
      await expect(footerContainer).not.toBeEmpty();

      await expect(footerContainer).toHaveScreenshot('footer-dark-default.png', {
        animations: 'disabled',
        timeout: TIMEOUTS.FAST,
      });
    });
  });
});
