/**
 * Home Page Component
 * Main page object that orchestrates all page components and their interactions
 */

import { Page } from '@playwright/test';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { PackageCard } from './components/PackageCard';
import { Footer } from './components/Footer';

export class HomePage {
  private page: Page;
  readonly header: Header;
  readonly searchBar: SearchBar;
  readonly packageCard: PackageCard;
  readonly footer: Footer;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.searchBar = new SearchBar(page);
    this.packageCard = new PackageCard(page);
    this.footer = new Footer(page);
  }

  /**
   * Gets the current page URL
   * @throws Error if URL cannot be retrieved
   */
  async getCurrentUrl(): Promise<string> {
    try {
      await this.page.waitForLoadState('networkidle');

      const currentUrl = this.page.url();

      if (!currentUrl) {
        throw new Error('Could not get current URL');
      }

      return currentUrl;
    } catch (error) {
      throw new Error(`Failed to get current URL: ${error}`);
    }
  }
}
