import { Page, Locator } from '@playwright/test';

export class PackageCard {
  private page: Page;

  private static readonly SELECTORS = {
    timePeriod: {
      button: '#time-period-select',
      allTime: '[role=menuitem][name="All time"]',
      oneMonth: '[role=menuitem][name="1 month"]',
      threeMonths: '[role=menuitem][name="3 months"]',
      sixMonths: '[role=menuitem][name="6 months"]',
      oneYear: '[role=menuitem][name="1 year"]',
      twoYears: '[role=menuitem][name="2 years"]',
      fiveYears: '[role=menuitem][name="5 years"]',
    },
    chart: {
      app: '[role="application"]',
    },
    toggleStats: {
      stats: { role: 'radio', name: 'Toggle stats' },
      info: { role: 'radio', name: 'Toggle info' },
    },
    table: {
      container: 'table',
    },
  } as const;

  // Locators
  private readonly timePeriodButton: Locator;
  private readonly chart: Locator;
  private readonly toggleStatsButton: Locator;
  private readonly toggleInfoButton: Locator;
  private readonly tableContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    this.timePeriodButton = this.page.locator(PackageCard.SELECTORS.timePeriod.button);
    this.chart = this.page.locator(PackageCard.SELECTORS.chart.app);
    this.toggleStatsButton = this.page.getByRole(PackageCard.SELECTORS.toggleStats.stats.role, {
      name: PackageCard.SELECTORS.toggleStats.stats.name,
    });
    this.toggleInfoButton = this.page.getByRole(PackageCard.SELECTORS.toggleStats.info.role, {
      name: PackageCard.SELECTORS.toggleStats.info.name,
    });
    this.tableContainer = this.page.locator(PackageCard.SELECTORS.table.container);
  }

  async isTimePeriodVisible(): Promise<boolean> {
    try {
      await this.timePeriodButton.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isChartVisible(): Promise<boolean> {
    try {
      await this.chart.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isStatsButtonVisible(): Promise<boolean> {
    try {
      await this.toggleStatsButton.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isInfoButtonVisible(): Promise<boolean> {
    try {
      await this.toggleInfoButton.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isTableVisible(): Promise<boolean> {
    try {
      await this.tableContainer.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}


