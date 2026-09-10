const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const api = 'http://127.0.0.1:43801';
const web = 'http://127.0.0.1:43802';
const reports = [];
const artifacts = process.env.RED_RECOVERY_ARTIFACTS || '/tmp/red-recovery-browser';
fs.mkdirSync(artifacts, { recursive: true });
async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const publicHeaders = [];
    page.on('request', (request) => {
      if (/\/users\/(login|password-recovery)$/.test(request.url())) publicHeaders.push(request.headers().authorization);
    });
    await page.goto(`${web}/login`);
    await page.getByLabel('Identificador da empresa', { exact: true }).fill('ui-company');
    await page.getByLabel('Email', { exact: true }).fill('web@example.com');
    await page.getByRole('button', { name: 'Esqueci minha senha' }).focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    assert(await page.getByRole('button', { name: 'Enviar senha temporária' }).evaluate((el) => el === document.activeElement), 'recovery is keyboard reachable');
    await page.keyboard.press('Enter');
    await page.getByRole('status').filter({ hasText: 'Se os dados corresponderem' }).waitFor();
    for (const width of [1280, 360]) {
      await page.setViewportSize({ width, height: 800 });
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      reports.push({ screen: 'recovery', width, violations: audit.violations });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'recovery fits viewport');
      await page.screenshot({ path: `${artifacts}/recovery-${width}.png`, fullPage: true });
    }
    let temporary;
    for (let i = 0; i < 40; i++) {
      const response = await fetch(`${api}/__test/mail/web@example.com`);
      if (response.ok) { temporary = (await response.json()).password; break; }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    assert(temporary, 'worker delivered local email');
    await page.getByLabel('Senha', { exact: true }).fill(temporary);
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await page.waitForURL('**/change-password');
    const restrictedToken = await page.evaluate(() => localStorage.getItem('token'));
    assert((await fetch(`${api}/probe`, { headers: { Authorization: `Bearer ${restrictedToken}` } })).status === 403);
    await page.goto(`${web}/`);
    await page.waitForURL('**/change-password');
    for (const width of [1280, 360]) {
      await page.setViewportSize({ width, height: 800 });
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      reports.push({ screen: 'password-change', width, violations: audit.violations });
      assert.equal(audit.violations.length, 0, 'password-change accessibility');
      assert.equal(await page.getByRole('navigation').count(), 0, 'restricted screen excludes business navigation');
      const field = await page.locator('#newPassword').boundingBox();
      assert(field.width >= Math.min(280, width - 48), 'password field retains usable width');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'password change fits viewport');
      await page.screenshot({ path: `${artifacts}/password-change-${width}.png`, fullPage: true });
    }
    await page.locator('#currentPassword').fill(temporary);
    await page.locator('#newPassword').fill('BrowserReplacement123!');
    await page.locator('#confirmPassword').fill('BrowserReplacement123!');
    await page.locator('form button[type=submit]').click();
    await page.waitForURL(`${web}/`);
    const newToken = await page.evaluate(() => localStorage.getItem('token'));
    assert.equal((await fetch(`${api}/probe`, { headers: { Authorization: `Bearer ${newToken}` } })).status, 200, 'replacement token permits business API');
    assert.equal((await fetch(`${api}/users/change-initial-password`, { method: 'POST', headers: { Authorization: `Bearer ${restrictedToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: temporary, newPassword: 'UnusedReplacement123!', confirmPassword: 'UnusedReplacement123!' }) })).status, 401, 'old token rejected on its only permitted route');
    assert(publicHeaders.every((header) => !header), 'public requests exclude bearer tokens');
    fs.writeFileSync(`${artifacts}/a11y.json`, JSON.stringify(reports, null, 2));
    console.log('PASS browser recovery, Mailpit delivery, mandatory routing, replacement and session invalidation; keyboard and 360/1280px overflow checks');
    console.log('Accessibility violations:', reports.map((r) => ({ screen: r.screen, width: r.width, ids: r.violations.map((v) => v.id) })));
  } finally { await browser.close(); }
}
main().catch((error) => { console.error('FAIL browser verification:', error.name); process.exitCode = 1; });
