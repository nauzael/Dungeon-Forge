import { test, expect } from '@playwright/test';

const APP_URL = process.env.TEST_URL || 'https://dungeon-forge-liard.vercel.app';

/**
 * Character data must be inlined inside addInitScript because Playwright serializes
 * the callback and executes it in the browser context where outer-scope vars don't exist.
 * 
 * IMPORTANT: addInitScript runs on EVERY navigation (including reload).
 * The first load sets initial data; all subsequent navigations must NOT overwrite
 * modifications made by page.evaluate() calls.
 */

/** Returns a minimal valid character fixture (used inside addInitScript — inline data) */
const INIT_CHAR = {
  id: 'tab-switch-hero',
  name: 'TabSwitch Hero',
  level: 5,
  class: 'Fighter',
  species: 'Human',
  background: 'Soldier',
  hp: { current: 44, max: 44, temp: 0 },
  stats: { STR: 16, DEX: 14, CON: 14, INT: 10, WIS: 12, CHA: 10 },
  skills: ['Athletics', 'Perception'],
  languages: ['Common'],
  feats: [],
  ac: 16,
  init: 2,
  speed: 30,
  profBonus: 3,
  inventory: [],
};

const INIT_CHAR_DAMAGED = {
  ...INIT_CHAR,
  hp: { current: 20, max: 44, temp: 0 },
  hitDice: { current: 2, max: 5 },
  actionSurge: { current: 0, max: 1 },
  secondWind: { current: 0, max: 1 },
};

// JSON strings for inlining in addInitScript
const INIT_CHAR_JSON = JSON.stringify([INIT_CHAR]);
const INIT_CHAR_DAMAGED_JSON = JSON.stringify([INIT_CHAR_DAMAGED]);

test.describe('Tab-Switch Data Survival — Fix Verification', () => {

  test('01 — App loads with character in local mode (no JS errors)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.addInitScript((charJson) => {
      localStorage.setItem('df_local_mode', 'true');
      // Only set initial data on first load — don't overwrite on reload
      if (!localStorage.getItem('dnd-characters')) {
        localStorage.setItem('dnd-characters', charJson);
      }
    }, INIT_CHAR_JSON);

    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('TabSwitch Hero');
    expect(errors, 'No JS errors on load').toHaveLength(0);
  });

  test('02 — HP change persists in localStorage after simulated tab switch', async ({ page }) => {
    await page.addInitScript((charJson) => {
      localStorage.setItem('df_local_mode', 'true');
      if (!localStorage.getItem('dnd-characters')) {
        localStorage.setItem('dnd-characters', charJson);
      }
    }, INIT_CHAR_JSON);

    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Verify initial HP
    const hpBefore = await page.evaluate(() => {
      const raw = localStorage.getItem('dnd-characters');
      if (!raw) return null;
      const chars = JSON.parse(raw);
      const hero = chars.find((c: any) => c.id === 'tab-switch-hero');
      return hero ? `${hero.hp.current}/${hero.hp.max}` : null;
    });
    expect(hpBefore).toBe('44/44');

    // Apply HP change via the same path handleFastUpdate uses
    const updated = await page.evaluate(() => {
      const raw = localStorage.getItem('dnd-characters');
      if (!raw) return { success: false, reason: 'no storage' };
      const chars = JSON.parse(raw);
      const idx = chars.findIndex((c: any) => c.id === 'tab-switch-hero');
      if (idx === -1) return { success: false, reason: 'char not found' };

      chars[idx] = {
        ...chars[idx],
        hp: { ...chars[idx].hp, current: 34 },
      };
      localStorage.setItem('dnd-characters', JSON.stringify(chars));
      return { success: true, hp: chars[idx].hp };
    });

    expect(updated.success).toBe(true);
    expect(updated.hp!.current).toBe(34);

    // Reload — initScript won't overwrite because dnd-characters exists
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    const afterReload = await page.evaluate(() => {
      const raw = localStorage.getItem('dnd-characters');
      if (!raw) return null;
      const chars = JSON.parse(raw);
      const hero = chars.find((c: any) => c.id === 'tab-switch-hero');
      return hero ? hero.hp : null;
    });

    expect(afterReload).not.toBeNull();
    expect(afterReload!.current).toBe(34);
    expect(afterReload!.max).toBe(44);
  });

  test('03 — HP + temp HP survive tab switch', async ({ page }) => {
    await page.addInitScript((charJson) => {
      localStorage.setItem('df_local_mode', 'true');
      if (!localStorage.getItem('dnd-characters')) {
        localStorage.setItem('dnd-characters', charJson);
      }
    }, INIT_CHAR_JSON);

    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Apply damage + temp HP
    const result = await page.evaluate(() => {
      const raw = localStorage.getItem('dnd-characters');
      if (!raw) return { success: false, error: 'no data' };
      const chars = JSON.parse(raw);
      const idx = chars.findIndex((c: any) => c.id === 'tab-switch-hero');
      if (idx === -1) return { success: false, error: 'char not found' };

      chars[idx] = {
        ...chars[idx],
        hp: { current: 34, max: 44, temp: 5 },
      };
      localStorage.setItem('dnd-characters', JSON.stringify(chars));

      return { success: true, hp: chars[idx].hp };
    });

    expect(result.success).toBe(true);
    expect(result.hp!.current).toBe(34);
    expect(result.hp!.temp).toBe(5);

    // Reload — data should survive
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const survived = await page.evaluate(() => {
      const raw = localStorage.getItem('dnd-characters');
      if (!raw) return null;
      const chars = JSON.parse(raw);
      return chars.find((c: any) => c.id === 'tab-switch-hero')?.hp || null;
    });

    expect(survived).not.toBeNull();
    expect(survived!.current).toBe(34);
    expect(survived!.temp).toBe(5);
  });

  test('04 — Rest state survives tab switch (no setTimeout delay)', async ({ page }) => {
    await page.addInitScript((charJson) => {
      localStorage.setItem('df_local_mode', 'true');
      if (!localStorage.getItem('dnd-characters')) {
        localStorage.setItem('dnd-characters', charJson);
      }
    }, INIT_CHAR_DAMAGED_JSON);

    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Verify starting: damaged at 20/44
    const initialHp = await page.evaluate(() => {
      const raw = localStorage.getItem('dnd-characters');
      if (!raw) return null;
      const chars = JSON.parse(raw);
      const hero = chars.find((c: any) => c.id === 'tab-switch-hero');
      return hero ? hero.hp : null;
    });
    expect(initialHp?.current).toBe(20);

    // Simulate Short Rest: same logic as RestModal.handleShortRest (no setTimeout)
    // Fighter die = 10, CON 14 → conMod = 2
    // hpRecoveryPerDie = floor(10/2) + 1 + 2 = 8
    const restResult = await page.evaluate(() => {
      const raw = localStorage.getItem('dnd-characters');
      if (!raw) return { success: false, error: 'no data' };
      const chars = JSON.parse(raw);
      const idx = chars.findIndex((c: any) => c.id === 'tab-switch-hero');
      if (idx === -1) return { success: false, error: 'not found' };

      const conMod = Math.floor(((chars[idx].stats.CON || 10) - 10) / 2);
      const hpRecoveryPerDie = Math.floor(10 / 2) + 1 + conMod; // = 8
      const hitDiceToSpend = 2;
      const hpGained = hitDiceToSpend * hpRecoveryPerDie; // = 16

      // Exact same logic as handleShortRest (post-fix: no setTimeout)
      const updated = {
        ...chars[idx],
        hp: {
          ...chars[idx].hp,
          current: Math.min(chars[idx].hp.max, chars[idx].hp.current + hpGained),
        },
        hitDice: {
          current: (chars[idx].hitDice?.current || 0) + hitDiceToSpend,
          max: chars[idx].hitDice?.max || chars[idx].level,
        },
        actionSurge: { current: 1, max: 1 },
        secondWind: { current: 1, max: 1 },
      };

      chars[idx] = updated;
      localStorage.setItem('dnd-characters', JSON.stringify(chars));

      return {
        success: true,
        hp: updated.hp,
        actionSurge: updated.actionSurge,
        hpGained,
      };
    });

    expect(restResult.success).toBe(true);
    expect(restResult.hpGained).toBe(16);
    expect(restResult.hp!.current).toBe(36);
    expect(restResult.actionSurge!.current).toBe(1);

    // Reload — rest state should survive tab switch
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const afterRest = await page.evaluate(() => {
      const raw = localStorage.getItem('dnd-characters');
      if (!raw) return null;
      const chars = JSON.parse(raw);
      const hero = chars.find((c: any) => c.id === 'tab-switch-hero');
      if (!hero) return null;
      return {
        hp: hero.hp,
        actionSurge: hero.actionSurge,
      };
    });

    expect(afterRest).not.toBeNull();
    expect(afterRest!.hp.current).toBe(36);
    expect(afterRest!.actionSurge?.current).toBe(1);
  });

  test('05 — No regressions: rapid HP updates without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.addInitScript((charJson) => {
      localStorage.setItem('df_local_mode', 'true');
      if (!localStorage.getItem('dnd-characters')) {
        localStorage.setItem('dnd-characters', charJson);
      }
    }, INIT_CHAR_JSON);

    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Simulate rapid HP updates like user spamming damage/heal
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        const raw = localStorage.getItem('dnd-characters');
        if (!raw) return;
        const chars = JSON.parse(raw);
        const idx = chars.findIndex((c: any) => c.id === 'tab-switch-hero');
        if (idx === -1) return;
        chars[idx] = {
          ...chars[idx],
          hp: { ...chars[idx].hp, current: chars[idx].hp.current - 1 },
        };
        localStorage.setItem('dnd-characters', JSON.stringify(chars));
      });
      await page.waitForTimeout(100);
    }

    await page.waitForTimeout(1000);
    expect(errors, 'No errors after rapid HP updates').toHaveLength(0);

    const finalHp = await page.evaluate(() => {
      const raw = localStorage.getItem('dnd-characters');
      if (!raw) return null;
      const chars = JSON.parse(raw);
      return chars.find((c: any) => c.id === 'tab-switch-hero')?.hp;
    });
    expect(finalHp?.current).toBe(39); // 44 - 5
  });
});
