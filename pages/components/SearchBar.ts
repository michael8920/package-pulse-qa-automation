import { Page, Locator } from '@playwright/test';

export class SearchBar {
  private page: Page;

  private static readonly SELECTORS = {
    searchBar: {
      input: '#search',
      dropdown: '[role="listbox"]',
      results: '[role="option"]',
      noResults: 'text="No project found."',
    },
  } as const;

  // Locators
  private readonly inputField: Locator;
  private readonly projectsDropdown: Locator;
  private readonly searchResults: Locator;
  private readonly emptySearch: Locator;

  constructor(page: Page) {
    this.page = page;

    this.inputField = this.page.locator(SearchBar.SELECTORS.searchBar.input);
    this.projectsDropdown = this.page.locator(SearchBar.SELECTORS.searchBar.dropdown);
    this.searchResults = this.page.locator(SearchBar.SELECTORS.searchBar.results);
    this.emptySearch = this.page.locator(SearchBar.SELECTORS.searchBar.noResults);
  }

  async searchForProject(name: string): Promise<Locator> {
    try {
      await this.inputField.waitFor({ state: 'visible' });

      await this.inputField.fill(name);

      await this.inputField.click();

      await this.projectsDropdown.waitFor({ state: 'visible' });

      const result = this.searchResults.filter({ hasText: new RegExp(`^${name}$`) });

      await result.waitFor({ state: 'visible' });

      return result;
    } catch (error) {
      throw new Error(`Failed to search for project ${name}: ${error}`);
    }
  }
  async selectProject(name: string): Promise<void> {
    try {
      const result = await this.searchForProject(name);
      await result.click();
    } catch (error) {
      throw new Error(`Failed to select project ${name}: ${error}`);
    }
  }
}
