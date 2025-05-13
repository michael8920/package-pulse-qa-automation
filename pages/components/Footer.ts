/**
 * Footer Component
 * Handles interactions with the application's footer section
 */

import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../../utils/constants';

/** Available footer elements for interaction */
export enum FooterElement {
  CONTAINER = 'container',
}

export class Footer {
  private page: Page;

  /** CSS selectors for footer elements */
  private static readonly SELECTORS = {
    container: 'footer.mt-4.flex',
  } as const;

  private readonly footerContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    this.footerContainer = this.page.locator(Footer.SELECTORS.container);
  }

  /**
   * Gets a footer element by type
   * @throws Error if element not found or not visible
   */
  async getElement(elementType: FooterElement): Promise<Locator> {
    try {
      const elementMap: Record<FooterElement, Locator> = {
        [FooterElement.CONTAINER]: this.footerContainer,
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

  /** Checks if footer is visible on the page */
  async isFooterVisible(): Promise<boolean> {
    try {
      await this.footerContainer.waitFor({ state: 'visible', timeout: TIMEOUTS.FAST });
      return true;
    } catch {
      return false;
    }
  }
}
