import { Page } from '@playwright/test';

export async function prepareForVisualTest(page: Page) {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.addStyleTag({
    content: `
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
            }
        `,
  });

  await page.addStyleTag({
    content: `
            .dynamic-date, 
            .loading-indicator {
                visibility: hidden !important;
            }
        `,
  });
}
