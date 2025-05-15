import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../../utils/constants';

export enum FooterElement {
  CONTAINER = 'container',
}
export class Footer {
  private page: Page;

  private static readonly SELECTORS = {
    container: 'footer.mt-4.flex',
  } as const;

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

      await element.waitFor({ state: 'visible', timeout: TIMEOUTS.FAST });

      return element;
    } catch (error) {
      throw new Error(`Could not get element ${elementType}: ${error}`);
    }
  }

  async isFooterVisible(): Promise<boolean> {
    try {
      await this.footerContainer.waitFor({ state: 'visible', timeout: TIMEOUTS.FAST });
      return true;
    } catch {
      return false;
    }
  }
}
