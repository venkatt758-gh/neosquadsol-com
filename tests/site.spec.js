import { test, expect } from '@playwright/test';

test('website loads without broken local resources or script errors', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('One squad.');
  await expect(page.getByRole('img', { name: /connected around/ })).toBeVisible();
  for (const href of await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')))) {
    await expect(page.locator(href)).toHaveCount(1);
  }
  expect(errors).toEqual([]);
  await expect(page.locator('body')).not.toContainText('draft');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.neosquadsol.com/');
  const address = page.getByLabel('Company address');
  await expect(address).toBeVisible();
  await expect(address).toContainText('13th Floor, Building No. 9, Survey No. 64,');
  await expect(address).toContainText('WeWork, K Raheja Mindspace, Mindspace Madhapur Road,');
  await expect(address).toContainText('HITEC City, Madhapur, Hyderabad,');
  await expect(address).toContainText('Telangana - 500081');
  await expect(page.getByRole('link', { name: 'Call NeoSquad at +91 63057 27062' })).toHaveAttribute('href', 'tel:+916305727062');
  await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true });
});

test('service tabs support pointer and keyboard navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /Apply AI/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Less hype.');
  await expect(page.getByRole('tab', { name: /Apply AI/ })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tabpanel')).toContainText('A connected squad.');
  await page.keyboard.press('Home');
  await expect(page.getByRole('tabpanel')).toContainText('Better foundations.');
});

test('enquiry safely prepares a real email without claiming delivery', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Share your use case/ }).click();
  await expect(page.getByLabel("I'm interested in")).toHaveValue('Products');
  await page.getByLabel('Your name').fill('Draft Visitor');
  await page.getByLabel('Work email').fill('visitor@example.com');
  await page.getByLabel('Tell us a little more').fill('<img src=x onerror=alert(1)> A product idea.');
  await page.getByRole('button', { name: 'Prepare email' }).click();
  await expect(page.getByRole('status')).toContainText('has not been sent');
  await expect(page.getByRole('status')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.getByRole('status').locator('img')).toHaveCount(0);
  const mailto = await page.getByRole('link', { name: 'Open email app' }).getAttribute('href');
  expect(mailto).toContain('mailto:contact@neosquadsol.com?');
  const parameters = new URLSearchParams(mailto.split('?')[1]);
  expect(parameters.get('subject')).toBe('NeoSquad enquiry: Products');
  expect(parameters.get('body')).toContain('visitor@example.com');
  expect(parameters.get('body')).toContain('<img src=x onerror=alert(1)>');
  await page.getByLabel('Tell us a little more').fill('Changed enquiry');
  await expect(page.getByRole('status')).toBeHidden();
});

test('mobile menu and layout work at narrow widths', async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Menu' });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('navigation').getByRole('link', { name: 'Services', exact: true }).click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await menu.click();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  }
});

test('blank enquiries are rejected and can be corrected', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your name').fill('   ');
  await page.getByLabel('Work email').fill('visitor@example.com');
  await page.getByLabel('Tell us a little more').fill('   ');
  await page.getByRole('button', { name: 'Prepare email' }).click();
  await expect(page.getByRole('status')).toBeHidden();
  expect(await page.getByLabel('Your name').evaluate((input) => input.validity.valid)).toBe(false);
  await page.getByLabel('Your name').fill('Visitor');
  await page.getByLabel('Tell us a little more').fill('A service enquiry');
  await page.getByRole('button', { name: 'Prepare email' }).click();
  await expect(page.getByRole('status')).toContainText('ready to review');
});
