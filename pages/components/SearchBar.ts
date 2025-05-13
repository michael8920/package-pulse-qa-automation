/**
 * Search Bar Component
 * Handles project search functionality and dropdown interactions
 */

import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../../utils/constants';

/** Available search bar elements for interaction */
export enum SearchBarElement {
  CONTAINER = 'container',
  INPUT = 'input',
  DROPDOWN = 'dropdown',
  RESULTS = 'results',
  NO_RESULTS = 'no results',
}
export class SearchBar {
  private page: Page;

  /** CSS selectors and ARIA roles for search bar elements */
  private static readonly SELECTORS = {
    searchBar: {
      container: 'form.flex.flex-col.gap-4',
      input: '#search',
      dropdown: '[role="listbox"]',
      results: '[role="option"]',
      noResults: 'text="No project found."',
    },
  } as const;

  private readonly searchBarContainer: Locator;
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
    this.searchBarContainer = this.page.locator(SearchBar.SELECTORS.searchBar.container);
  }

  /**
   * Gets a search bar element by type
   * @throws Error if element not found or not visible
   */
  async getElement(elementType: SearchBarElement): Promise<Locator> {
    try {
      const elementMap: Record<SearchBarElement, Locator> = {
        [SearchBarElement.INPUT]: this.inputField,
        [SearchBarElement.DROPDOWN]: this.projectsDropdown,
        [SearchBarElement.RESULTS]: this.searchResults,
        [SearchBarElement.NO_RESULTS]: this.emptySearch,
        [SearchBarElement.CONTAINER]: this.searchBarContainer,
      };

      const element = elementMap[elementType];

      if (!element) {
        throw new Error(`Element type ${elementType} not found`);
      }

      await element.waitFor({ state: 'visible', timeout: TIMEOUTS.FAST });

      return element;
    } catch (error) {
      throw new Error(`Could not get element ${elementType}: ${error}`);
    }
  }

  /** Checks if search bar is visible */
  async isSearchBarVisible(): Promise<boolean> {
    try {
      await this.searchBarContainer.waitFor({ state: 'visible', timeout: TIMEOUTS.FAST });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Searches for a project by name
   * @returns Locator for the matching search result
   * @throws Error if search fails
   */
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

  /**
   * Selects a project from search results
   * @throws Error if selection fails
   */
  async selectProject(name: string): Promise<void> {
    try {
      const result = await this.searchForProject(name);
      await result.click();
    } catch (error) {
      throw new Error(`Failed to select project ${name}: ${error}`);
    }
  }
}
