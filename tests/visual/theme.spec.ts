import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { HeaderElement } from '../../pages/components/Header';
import { prepareForVisualTest } from '../../utils/visualTestHelpers';
import { FooterElement } from '../../pages/components/Footer';
import { SearchBarElement } from '../../pages/components/SearchBar';

test.describe('Theme visual regression tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await page.goto('/');
    await prepareForVisualTest(page);
  });

  test.describe('Light theme tests', () => {
    test('Header looks correctly in light mode', async ({ page }) => {
      await homePage.header.selectTheme('Light');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('light');

      const headerContainer = await homePage.header.getElement(HeaderElement.CONTAINER);

      await expect(homePage.header.isHeaderVisible()).resolves.toBeTruthy();
      await expect(headerContainer).not.toBeEmpty();

      await expect(headerContainer).toHaveScreenshot('header-light-default.png', {
        animations: 'disabled',
        timeout: 5000,
      });
    });

    test('Search bar looks correctly in light mode', async ({ page }) => {
      await homePage.header.selectTheme('Light');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('light');

      const searchBarContainer = await homePage.searchBar.getElement(SearchBarElement.CONTAINER);

      await expect(homePage.searchBar.isSearchBarVisible()).resolves.toBeTruthy();
      await expect(searchBarContainer).not.toBeEmpty();

      await expect(searchBarContainer).toHaveScreenshot('search-bar-landing-light-default.png', {
        animations: 'disabled',
        timeout: 5000,
      });

      await homePage.searchBar.selectProject('react');
      await expect(homePage.searchBar.isSearchBarVisible()).resolves.toBeTruthy();

      await expect(searchBarContainer).not.toBeEmpty();
      await expect(searchBarContainer).toHaveScreenshot('search-bar-home-light-default.png', {
        animations: 'disabled',
        timeout: 5000,
      });
    });

    test('Footer looks correctly in light mode', async ({ page }) => {
      await homePage.header.selectTheme('Light');
      const theme = await homePage.header.getCurrentTheme();
      expect(theme).toBe('light');

      const footerContainer = await homePage.footer.getElement(FooterElement.CONTAINER);

      await expect(homePage.footer.isFooterVisible()).resolves.toBeTruthy();
      await expect(footerContainer).not.toBeEmpty();

      await expect(footerContainer).toHaveScreenshot('footer-light-default.png', {
        animations: 'disabled',
        timeout: 5000,
      });
    });
  });
});
