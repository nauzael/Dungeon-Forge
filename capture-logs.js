import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', (err) => {
    consoleLogs.push({ type: 'error', text: `PAGE ERROR: ${err.message}` });
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded');

    // Wait for React to render - look for any text content
    await page.waitForTimeout(5000);

    // Get page content to debug what's visible
    const bodyText = await page.locator('body').textContent();
    console.log('\nPage body text (first 500 chars):', bodyText?.slice(0, 500));

    // List all buttons
    const allButtons = await page.locator('button').all();
    console.log(`\nTotal buttons found: ${allButtons.length}`);
    for (let i = 0; i < allButtons.length; i++) {
      const text = await allButtons[i].textContent();
      console.log(`  Button ${i}: "${text?.trim()}"`);
    }

    // Get all links
    const allLinks = await page.locator('a').all();
    console.log(`\nTotal links found: ${allLinks.length}`);
    for (let i = 0; i < allLinks.length; i++) {
      const text = await allLinks[i].textContent();
      const href = await allLinks[i].getAttribute('href');
      console.log(`  Link ${i}: "${text?.trim()}" -> ${href}`);
    }

    // Try to find and click Login button if exists
    const loginButton = page
      .locator('button')
      .filter({ hasText: /Entrar|Login|Sign in/i })
      .first();
    if (await loginButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      console.log('\nClicking Login button...');
      await loginButton.click();
      await page.waitForTimeout(3000);
    }

    // List buttons again
    const buttonsAfterLogin = await page.locator('button').all();
    console.log(`\nButtons after login attempt: ${buttonsAfterLogin.length}`);
    for (let i = 0; i < buttonsAfterLogin.length; i++) {
      const text = await buttonsAfterLogin[i].textContent();
      console.log(`  Button ${i}: "${text?.trim()}"`);
    }

    // Look for DM Dashboard button
    const dmButton = page
      .locator('button')
      .filter({ hasText: /DM|Dungeon|Maestro|Dashboard/i })
      .first();
    if (await dmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      console.log('\nClicking DM Dashboard button...');
      await dmButton.click();
      await page.waitForTimeout(3000);
    }

    // List buttons after DM click
    const buttonsAfterDM = await page.locator('button').all();
    console.log(`\nButtons after DM click: ${buttonsAfterDM.length}`);
    for (let i = 0; i < buttonsAfterDM.length; i++) {
      const text = await buttonsAfterDM[i].textContent();
      console.log(`  Button ${i}: "${text?.trim()}"`);
    }

    // Look for Campaign/Atlas button
    const atlasButton = page
      .locator('button')
      .filter({ hasText: /Campaign|Recursos|Rally|Atlas/i })
      .first();
    if (await atlasButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      console.log('\nClicking Atlas/Campaign button...');
      await atlasButton.click();
      await page.waitForTimeout(3000);
    }

    // Check for file input
    const fileInput = page.locator('input[type="file"]');
    const fileInputVisible = await fileInput.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`\nFile input visible: ${fileInputVisible}`);

    console.log('\n=== ALL CONSOLE LOGS ===');
    consoleLogs.forEach((log) => {
      console.log(`[${log.type}] ${log.text}`);
    });
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
