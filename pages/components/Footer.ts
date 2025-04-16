import { Page, Locator } from '@playwright/test';

export enum FooterElement {
  CONTAINER = 'container',
}
export class Footer {
  private page: Page;

  private static readonly SELECTORS = {
    container: 'footer.mt-4.flex',
  } as const;

  // Locators
  private readonly footerContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    this.footerContainer = this.page.locator(Footer.SELECTORS.container);
  }

  async getElement(elementType: FooterElement): Promise<Locator> {
    try {
      const elementMap: Record<FooterElement, Locator> = {
        [FooterElement.CONTAINER]: this.footerContainer,
      };

      const element = elementMap[elementType];

      if (!element) {
        throw new Error(`Element type ${elementType} not found`);
      }

      await element.waitFor({ state: 'visible', timeout: 5000 });

      return element;
    } catch (error) {
      throw new Error(`Could not get element ${elementType}: ${error}`);
    }
  }

  async isFooterVisible(): Promise<boolean> {
    try {
      await this.footerContainer.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
