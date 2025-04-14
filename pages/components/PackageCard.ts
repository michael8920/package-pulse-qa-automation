import { Page, Locator } from '@playwright/test';
import { unwatchFile } from 'fs';
import { parse } from 'path';

export enum TimePeriod {
  ALL_TIME = 'All time',
  ONE_MONTH = '1 month',
  THREE_MONTHS = '3 months',
  SIX_MONTHS = '6 months',
  ONE_YEAR = '1 year',
  TWO_YEARS = '2 years',
  FIVE_YEARS = '5 years',
}

export enum PackageCardElement {
  CHART = 'chart',
  TOOLTIP = 'tooltip',
  TIME_PERIOD = 'timePeriod',
  INFO_BUTTON = 'infoButton',
  STATS_BUTTON = 'statsButton',
  TABLE = 'table',
}
interface TooltipDetails {
  date: string;
  packageName: string;
  downloads: number;
}
export class PackageCard {
  private page: Page;

  private static readonly SELECTORS = {
    timePeriod: {
      button: '#time-period-select',
      allTime: { role: 'option', name: 'All time' },
      oneMonth: { role: 'option', name: '1 month' },
      threeMonths: { role: 'option', name: '3 months' },
      sixMonths: { role: 'option', name: '6 months' },
      oneYear: { role: 'option', name: '1 year' },
      twoYears: { role: 'option', name: '2 years' },
      fiveYears: { role: 'option', name: '5 years' },
    },
    chart: {
      app: '[role="application"]',
      xAxisContainer: '.recharts-layer.recharts-cartesian-axis.recharts-xAxis.xAxis',
      yAxisContainer: '.recharts-layer.recharts-cartesian-axis.recharts-yAxis.yAxis',
      tooltip: {
        container: '.recharts-tooltip-wrapper',
        content: {
          downloads: 'span.font-mono.font-medium.tabular-nums.text-foreground',
          name: 'span.text-muted-foreground',
          date: 'div.font-medium',
        },
      },
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
  private readonly allTimePeriod: Locator;
  private readonly oneMonthPeriod: Locator;
  private readonly threeMonthsPeriod: Locator;
  private readonly sixMonthsPeriod: Locator;
  private readonly oneYearPeriod: Locator;
  private readonly twoYearsPeriod: Locator;
  private readonly fiveYearsPeriod: Locator;

  private readonly chart: Locator;
  private readonly xAxisContainer: Locator;
  private readonly yAxisContainer: Locator;
  private readonly tooltipContainer: Locator;
  private readonly tooltipName: Locator;
  private readonly tooltipDownloads: Locator;
  private readonly tooltipDate: Locator;

  private readonly toggleStatsButton: Locator;
  private readonly toggleInfoButton: Locator;
  private readonly tableContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    this.timePeriodButton = this.page.locator(PackageCard.SELECTORS.timePeriod.button);
    this.allTimePeriod = this.page.getByRole(PackageCard.SELECTORS.timePeriod.allTime.role, {
      name: PackageCard.SELECTORS.timePeriod.allTime.name,
    });
    this.oneMonthPeriod = this.page.getByRole(PackageCard.SELECTORS.timePeriod.oneMonth.role, {
      name: PackageCard.SELECTORS.timePeriod.oneMonth.name,
    });
    this.threeMonthsPeriod = this.page.getByRole(PackageCard.SELECTORS.timePeriod.threeMonths.role, {
      name: PackageCard.SELECTORS.timePeriod.threeMonths.name,
    });
    this.sixMonthsPeriod = this.page.getByRole(PackageCard.SELECTORS.timePeriod.sixMonths.role, {
      name: PackageCard.SELECTORS.timePeriod.sixMonths.name,
    });
    this.oneYearPeriod = this.page.getByRole(PackageCard.SELECTORS.timePeriod.oneYear.role, {
      name: PackageCard.SELECTORS.timePeriod.oneYear.name,
    });
    this.twoYearsPeriod = this.page.getByRole(PackageCard.SELECTORS.timePeriod.twoYears.role, {
      name: PackageCard.SELECTORS.timePeriod.twoYears.name,
    });
    this.fiveYearsPeriod = this.page.getByRole(PackageCard.SELECTORS.timePeriod.fiveYears.role, {
      name: PackageCard.SELECTORS.timePeriod.fiveYears.name,
    });

    this.chart = this.page.locator(PackageCard.SELECTORS.chart.app);
    this.xAxisContainer = this.page.locator(PackageCard.SELECTORS.chart.xAxisContainer);
    this.yAxisContainer = this.page.locator(PackageCard.SELECTORS.chart.yAxisContainer);
    this.tooltipContainer = this.page.locator(PackageCard.SELECTORS.chart.tooltip.container);
    this.tooltipName = this.page.locator(PackageCard.SELECTORS.chart.tooltip.content.name);
    this.tooltipDownloads = this.page.locator(PackageCard.SELECTORS.chart.tooltip.content.downloads);
    this.tooltipDate = this.page.locator(PackageCard.SELECTORS.chart.tooltip.content.date);

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

  async changeTimePeriod(period: TimePeriod): Promise<void> {
    try {
      await this.timePeriodButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.timePeriodButton.click();

      let periodLocator;
      switch (period) {
        case TimePeriod.ALL_TIME:
          periodLocator = this.allTimePeriod;
          break;
        case TimePeriod.ONE_MONTH:
          periodLocator = this.oneMonthPeriod;
          break;
        case TimePeriod.THREE_MONTHS:
          periodLocator = this.threeMonthsPeriod;
          break;
        case TimePeriod.SIX_MONTHS:
          periodLocator = this.sixMonthsPeriod;
          break;
        case TimePeriod.ONE_YEAR:
          periodLocator = this.oneYearPeriod;
          break;
        case TimePeriod.TWO_YEARS:
          periodLocator = this.twoYearsPeriod;
          break;
        case TimePeriod.FIVE_YEARS:
          periodLocator = this.fiveYearsPeriod;
          break;
      }

      await periodLocator.waitFor({ state: 'visible', timeout: 5000 });
      await periodLocator.click();
    } catch (error) {
      throw new Error(`Time period could not be changed to ${period}: ${error}`);
    }
  }

  async getTimePeriodOption(): Promise<string> {
    try {
      await this.timePeriodButton.waitFor({ state: 'visible', timeout: 5000 });
      return (await this.timePeriodButton.innerText()).trim();
    } catch (error) {
      throw new Error(`Could not get the current time period option: ${error}`);
    }
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }

  async getChartAxisValues(axis: 'x' | 'y'): Promise<string[]> {
    try {
      await this.chart.waitFor({ state: 'visible', timeout: 5000 });

      const container =
        axis === 'x' ? PackageCard.SELECTORS.chart.xAxisContainer : PackageCard.SELECTORS.chart.yAxisContainer;

      const axisTicks = this.page.locator(`${container} tspan`);
      await axisTicks.first().waitFor({ state: 'visible', timeout: 5000 });

      const tickValues = await axisTicks.evaluateAll((elements) => elements.map((el) => el.textContent || ''));

      return tickValues.filter((value) => value && value.trim() !== '');
    } catch (error) {
      throw new Error(`Could not get chart ${axis}-axis values: ${error}`);
    }
  }

  async areDatesInYearRange(yearsBack: '1 year' | '2 years' | '5 years'): Promise<boolean> {
    try {
      const tickValues = await this.getChartAxisValues('x');

      const currentYear = this.getCurrentYear();
      const uniqueYearsInDates = [...new Set(tickValues.map((value) => value.slice(0, 4)))];

      const years = uniqueYearsInDates.map(Number).sort((a, b) => a - b);
      const yearCount = years.length;
      const oldestYear = years[0];
      const newestYear = years[yearCount - 1];

      if (newestYear !== currentYear) {
        return false;
      }

      const rangeRequirements = {
        '1 year': {
          validCounts: [1, 2],
          minYear: currentYear - 1,
        },
        '2 years': {
          validCounts: [2, 3],
          minYear: currentYear - 2,
        },
        '5 years': {
          validCounts: [4, 5, 6],
          minYear: currentYear - 5,
        },
      };

      const requirement = rangeRequirements[yearsBack];

      return requirement.validCounts.includes(yearCount) && oldestYear >= requirement.minYear;
    } catch (error) {
      throw new Error(`Could not check if the dates are in range: ${error}`);
    }
  }

  async areDatesInMonthRange(monthsBack: '1 month' | '3 months' | '6 months'): Promise<boolean> {
    try {
      const tickValues = await this.getChartAxisValues('x');
      const currentMonth = this.getCurrentMonth();
      console.log(`Current month: ${currentMonth}`);
      const uniqueMonthsInDates = [...new Set(tickValues.map((value) => value.slice(5, 7)))];
      console.log(`These are unique months in the chart: ${uniqueMonthsInDates}`);

      const months = uniqueMonthsInDates.map(Number).sort((a, b) => a - b);
      const monthCount = months.length;
      const oldestMonth = months[0];
      const newestMonth = months[monthCount - 1];

      const normalizeMonth = (month: number): number => {
        if (month < 1) return month + 12;
        if (month > 12) return month - 12;
        return month;
      };

      if (newestMonth !== currentMonth) {
        return false;
      }

      const rangeRequirements = {
        '1 month': {
          validCounts: [1, 2],
          minMonth: normalizeMonth(currentMonth - 1),
        },
        '3 months': {
          validCounts: [3, 4],
          minMonth: normalizeMonth(currentMonth - 3),
        },
        '6 months': {
          validCounts: [5, 6, 7],
          minMonth: normalizeMonth(currentMonth - 6),
        },
      };

      const requirement = rangeRequirements[monthsBack];

      const isInRange =
        oldestMonth >= requirement.minMonth || (requirement.minMonth > currentMonth && oldestMonth >= 1);

      return requirement.validCounts.includes(monthCount) && isInRange;
    } catch (error) {
      throw new Error(`Could not check if the dates are in range: ${error}`);
    }
  }

  async isTooltipVisible(): Promise<boolean> {
    try {
      const isPresent = (await this.tooltipContainer.count()) > 0;
      if (!isPresent) return false;

      const visibility = await this.tooltipContainer.evaluate((el) => window.getComputedStyle(el).visibility);

      const isVisible = await this.tooltipContainer.isVisible();

      return isVisible && visibility === 'visible';
    } catch (error) {
      return false;
    }
  }

  async areTooltipDetailsVisible(): Promise<boolean> {
    try {
      await this.tooltipDate.waitFor({ state: 'visible', timeout: 5000 });
      await this.tooltipName.waitFor({ state: 'visible', timeout: 5000 });
      await this.tooltipDownloads.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getTooltipDetails(): Promise<TooltipDetails> {
    try {
      await this.tooltipContainer.waitFor({ state: 'visible', timeout: 5000 });

      const date = (await this.tooltipDate.textContent()) || '';
      const rawDownloads = (await this.tooltipDownloads.textContent()) || '';
      const packageName = (await this.tooltipName.textContent()) || '';

      if (!packageName.trim()) {
        throw new Error('Package name is missing');
      }

      const parsedDownloads = parseInt(rawDownloads.replace(/,/g, ''), 10);
      if (isNaN(parsedDownloads)) {
        throw new Error(`Invalid downloads format: ${rawDownloads}`);
      }

      const details: TooltipDetails = {
        date,
        packageName,
        downloads: parsedDownloads,
      };

      if (!details.date) throw new Error('Date is missing');
      if (!details.packageName) throw new Error('Package name is missing');
      if (!details.downloads) throw new Error('Downloads cannot be negative');

      return details;
    } catch (error) {
      throw new Error(`Could not get tooltip details: ${error}`);
    }
  }

  async moveToChartCenter(): Promise<void> {
    try {
      await this.chart.waitFor({ state: 'visible', timeout: 5000 });

      const box = await this.chart.boundingBox();

      if (!box) {
        throw new Error(`Could not get element boundaries`);
      }

      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await this.page.mouse.move(centerX, centerY, { steps: 10 });
    } catch (error) {
      throw new Error(`Could not move cursor to chart center: ${error}`);
    }
  }

  async moveMouseOnChart(offsetX: number = 0, offsetY: number = 0): Promise<void> {
    try {
      await this.chart.waitFor({ state: 'visible', timeout: 5000 });

      const box = await this.chart.boundingBox();
      if (!box) {
        throw new Error(`Could not get element boundaries`);
      }
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await this.page.mouse.move(centerX + offsetX, centerY + offsetY, { steps: 10 });
    } catch (error) {
      throw new Error(`Could not move cursor on the chart: ${error}`);
    }
  }

  isValidDateFormat(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
  }

  parseDate(dateString: string): Date {
    if (!this.isValidDateFormat(dateString)) {
      throw new Error(`Invalid date format: ${dateString}`);
    }
    return new Date(dateString);
  }

  async getElement(elementType: PackageCardElement): Promise<Locator> {
    try {
      const elementMap: Record<PackageCardElement, Locator> = {
        [PackageCardElement.CHART]: this.chart,
        [PackageCardElement.INFO_BUTTON]: this.toggleInfoButton,
        [PackageCardElement.STATS_BUTTON]: this.toggleStatsButton,
        [PackageCardElement.TABLE]: this.tableContainer,
        [PackageCardElement.TIME_PERIOD]: this.timePeriodButton,
        [PackageCardElement.TOOLTIP]: this.tooltipContainer,
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
}
