import { chromium } from 'playwright';

(async () => {
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      const response = await fetch('http://localhost:5173');
      if (response.ok) {
        serverReady = true;
        console.log('Server is ready!');
        break;
      }
    } catch (e) {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (!serverReady) {
    console.log('Server did not start in time');
    process.exit(1);
  }

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

    // Wait for full page load and any async operations
    await page.waitForTimeout(5000);

    console.log('\n=== ATLAS LOGS ===');
    consoleLogs.forEach((log) => {
      if (log.text.includes('[Atlas]')) {
        console.log(`[${log.type}] ${log.text}`);
      }
    });

    console.log('\n=== ALL ERROR LOGS ===');
    consoleLogs.forEach((log) => {
      if (log.type === 'error') {
        console.log(`[${log.type}] ${log.text}`);
      }
    });
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
