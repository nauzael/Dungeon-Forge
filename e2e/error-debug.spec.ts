import { test } from '@playwright/test';

const APP_URL = process.env.TEST_URL || 'https://dungeon-forge-liard.vercel.app';

test('Capture full error details for Yu TDZ error', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', (err) => {
    errors.push(`${err.message}\n${err.stack || '(no stack)'}`);
  });

  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log(`\n=== PAGE ERRORS (${errors.length}) ===`);
  errors.forEach((e, i) => console.log(`[${i}] ${e.substring(0, 500)}`));
  console.log(`\n=== PAGE TEXT (first 300) ===`);
  console.log((await page.locator('body').innerText()).substring(0, 300));

  test.expect(errors.length).toBe(0);
});
