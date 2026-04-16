import { chromium } from 'playwright';

(async () => {
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      const response = await fetch('http://localhost:5173');
      if (response.ok) {
        serverReady = true;
        break;
      }
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (!serverReady) {
    console.log('Server not ready');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const logs = [];
  page.on('console', (msg) => logs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', (err) => logs.push({ type: 'error', text: `PAGE: ${err.message}` }));

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Click Login button
    const loginBtn = page
      .locator('button')
      .filter({ hasText: /Login with Google/i })
      .first();
    if (await loginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Clicking Login...');
      await loginBtn.click();
      await page.waitForTimeout(5000);
      console.log('After login URL:', page.url());
    }

    // Get all buttons
    const btns = await page.locator('button').all();
    console.log(`\nButtons (${btns.length}):`);
    for (let i = 0; i < btns.length; i++) {
      console.log(`  ${i}: "${(await btns[i].textContent())?.trim()}"`);
    }

    // Click DM Dashboard
    const dmBtn = page
      .locator('button')
      .filter({ hasText: /DM|Dungeon|Maestro/i })
      .first();
    if (await dmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('\nClicking DM Dashboard...');
      await dmBtn.click();
      await page.waitForTimeout(3000);
    }

    console.log('\nAfter DM click - Buttons:');
    const btns2 = await page.locator('button').all();
    for (let i = 0; i < btns2.length; i++) {
      console.log(`  ${i}: "${(await btns2[i].textContent())?.trim()}"`);
    }

    // Click Campaign button
    const campBtn = page
      .locator('button')
      .filter({ hasText: /Campaign|Recursos|Rally|Atlas/i })
      .first();
    if (await campBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('\nClicking Campaign...');
      await campBtn.click();
      await page.waitForTimeout(3000);
    }

    console.log('\nAfter Campaign click - Buttons:');
    const btns3 = await page.locator('button').all();
    for (let i = 0; i < btns3.length; i++) {
      console.log(`  ${i}: "${(await btns3[i].textContent())?.trim()}"`);
    }

    // Click Add button
    const addBtn = page
      .locator('button')
      .filter({ hasText: /Add|subir|nuevo|agregar|Imagen/i })
      .first();
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('\nClicking Add...');
      await addBtn.click();
      await page.waitForTimeout(3000);
    }

    console.log('\nAfter Add click - Buttons:');
    const btns4 = await page.locator('button').all();
    for (let i = 0; i < btns4.length; i++) {
      console.log(`  ${i}: "${(await btns4[i].textContent())?.trim()}"`);
    }

    // Check file input
    const fileInput = page.locator('input[type="file"]');
    const fileVisible = await fileInput.isVisible({ timeout: 1000 }).catch(() => false);
    console.log(`\nFile input visible: ${fileVisible}`);

    console.log('\n=== ALL LOGS ===');
    logs.forEach((l) => console.log(`[${l.type}] ${l.text}`));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
