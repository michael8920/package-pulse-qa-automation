import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../../utils/constants';

export enum HeaderElement {
  CONTAINER = 'container',
}
export class Header {
  private page: Page;

  private static readonly SELECTORS = {
    container: 'header.flex',
    themeSelector: {
      label: '#theme-switch label',
      dropdown: '#theme-switch',
      options: {
        system: 'role=menuitem[name="System"]',
        dark: 'role=menuitem[name="Dark"]',
        light: 'role=menuitem[name="Light"]',
      },
    },
  } as const;

  private readonly headerContainer: Locator;
  private readonly themeSelectDropdown: Locator;
  private readonly themeSelectLabel: Locator;
  private readonly themeSelectLight: Locator;
  private readonly themeSelectDark: Locator;
  private readonly themeSelectSystem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.headerContainer = this.page.locator(Header.SELECTORS.container);
    this.themeSelectDropdown = this.page.locator(Header.SELECTORS.themeSelector.dropdown);
    this.themeSelectLabel = this.page.locator(Header.SELECTORS.themeSelector.label);
    this.themeSelectLight = this.page.locator(Header.SELECTORS.themeSelector.options.light);
    this.themeSelectDark = this.page.locator(Header.SELECTORS.themeSelector.options.dark);
    this.themeSelectSystem = this.page.locator(Header.SELECTORS.themeSelector.options.system);
  }

  async selectTheme(theme: 'System' | 'Light' | 'Dark'): Promise<void> {
    try {
      await this.themeSelectDropdown.waitFor({ state: 'visible' });

      await this.themeSelectDropdown.click();

      switch (theme) {
        case 'System':
          await this.themeSelectSystem.click();
          break;
        case 'Light':
          await this.themeSelectLight.click();
          break;
        case 'Dark':
          await this.themeSelectDark.click();
          break;
        default:
          throw new Error(`Unsupported theme: ${theme}`);
      }

      await this.page.waitForTimeout(500);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to select theme ${theme}: ${error.message}`);
      }
      throw new Error(`Failed to select theme ${theme}: ${error}`);
    }
  }

  async getCurrentTheme(): Promise<'light' | 'dark'> {
    try {
      const colorScheme = (await this.page.locator('html').evaluate((element) => {
        return window.getComputedStyle(element).colorScheme;
      })) as 'light' | 'dark';

      if (colorScheme !== 'light' && colorScheme !== 'dark') {
        throw new Error(`Invalid color scheme: ${colorScheme}`);
      }
      return colorScheme;
    } catch (error) {
      throw new Error(`Failed to get current theme: ${error}`);
    }
  }

  async isHeaderVisible(): Promise<boolean> {
    try {
      await this.headerContainer.waitFor({ state: 'visible', timeout: TIMEOUTS.FAST });
      return true;
    } catch {
      return false;
    }
  }

  async getElement(elementType: HeaderElement): Promise<Locator> {
    try {
      const elementMap: Record<HeaderElement, Locator> = {
        [HeaderElement.CONTAINER]: this.headerContainer,
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
}
