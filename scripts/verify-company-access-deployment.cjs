const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
async function main() {
  const artifacts = process.env.RED_COMPANY_ARTIFACTS || '/tmp/red-company-browser-results';
  fs.mkdirSync(artifacts, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
  const context = await browser.newContext();
  const preview = process.argv.includes('--preview');
  if (preview) await context.route('https://*.tipo.click/**', async route => {
    const pathname = new URL(route.request().url()).pathname;
    const root = path.resolve(__dirname, '../dist');
    const file = pathname.startsWith('/assets/') ? path.join(root, pathname) : path.join(root, 'index.html');
    await route.fulfill({ path: file, contentType: file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.png') ? 'image/png' : 'text/html' });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const companies = [['m4', 'M4', '88259e2a-305b-4daf-a5f5-78ad33d7c777'], ['ramon-lopes', 'Ramon Lopes', '6ef3da61-611d-4889-aa2b-159b8a9ba96a']];
  for (const [accessName, name, companyId] of companies) {
    const responsePromise = page.waitForResponse(response => response.url().endsWith('/companies/resolve-access'));
    await page.goto(`https://${accessName}.tipo.click/login`, { waitUntil: 'networkidle' });
    const response = await responsePromise;
    assert.equal(response.status(), 200);
    assert.deepEqual(await response.json(), { accessName, name, companyId });
    await page.getByRole('heading', { name: `Entrar em ${name}` }).waitFor();
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: `Entrar em ${name}` }).waitFor();
    await page.getByLabel('Email', { exact: true }).fill('unsent@example.com');
    await page.getByLabel('Senha', { exact: true }).fill('never-submitted');
    await page.screenshot({ path: `${artifacts}/${accessName}-${preview ? 'preview' : 'live'}.png` });
    console.log(JSON.stringify({ host: `${accessName}.tipo.click`, companyId, refresh: 'passed', mode: preview ? 'preview with live API' : 'live' }));
  }
  // A foreign stored session must be cleared before protected routes can mount.
  await page.evaluate(() => {
    localStorage.setItem('token', 'not-a-real-token');
    localStorage.setItem('user', JSON.stringify({ companyId: '88259e2a-305b-4daf-a5f5-78ad33d7c777' }));
    localStorage.setItem('authLastActivityAt', String(Date.now()));
  });
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => localStorage.getItem('token')), null);
  await page.goto('https://unassigned-smoke.tipo.click/login', { waitUntil: 'networkidle' });
  await page.getByRole('status').filter({ hasText: 'Empresa indisponível' }).waitFor();
  if (!preview) {
    await page.goto('https://tipo.click', { waitUntil: 'networkidle' });
    await page.getByRole('status').filter({ hasText: 'Abra o endereço de acesso da sua empresa' }).waitFor();
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ foreignStoredSession: 'cleared', unknownCompany: 'blocked', apex: preview ? 'deferred' : 'passed', javascriptErrors: errors.length }));
  await browser.close();
}
main().catch(error => { console.error(error); process.exitCode = 1; });
