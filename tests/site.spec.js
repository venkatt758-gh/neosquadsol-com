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

for (const width of [1280, 390]) {
  test(`enquiry posts correct fields to the provider at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.route('https://formsubmit.co/**', (route) => route.fulfill({
      status: 200, contentType: 'text/html', body: '<h1>Test intercepted submission</h1>',
    }));
    await page.goto('/');
    await page.getByRole('link', { name: /Share your use case/ }).click();
    await expect(page.getByLabel("I'm interested in")).toHaveValue('Products');
    await page.getByLabel('Your name').fill('Test Visitor');
    await page.getByLabel('Work email').fill('visitor@example.com');
    await page.getByLabel('Tell us a little more').fill('<img src=x onerror=alert(1)> A product idea.');
    await page.getByRole('checkbox').check();
    const [request] = await Promise.all([
      page.waitForRequest('https://formsubmit.co/contact@neosquadsol.com'),
      page.getByRole('button', { name: 'Send enquiry' }).click(),
    ]);
    expect(request.method()).toBe('POST');
    expect(request.isNavigationRequest()).toBe(true);
    const fields = new URLSearchParams(request.postData());
    expect(fields.get('name')).toBe('Test Visitor');
    expect(fields.get('email')).toBe('visitor@example.com');
    expect(fields.get('interest')).toBe('Products');
    expect(fields.get('message')).toBe('<img src=x onerror=alert(1)> A product idea.');
    expect(fields.get('consent')).toBe('Agreed to enquiry processing');
    expect(fields.get('_subject')).toBe('NeoSquad enquiry: Products');
    expect(fields.get('_next')).toBe('https://www.neosquadsol.com/thanks.html');
    expect(fields.get('_honey')).toBe('');
    expect(fields.get('_captcha')).not.toBe('false');
    await expect(page.getByRole('heading', { name: 'Test intercepted submission' })).toBeVisible();
  });
}

test('mobile menu and layout work at narrow widths', async ({ page }, testInfo) => {
  for (const width of [320, 390, 540, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const menu = page.getByRole('button', { name: /menu/i });
    await expect(menu).toHaveAccessibleName('Open menu');
    await expect(menu.locator('.menu-icon > span')).toHaveCount(3);
    const buttonBox = await menu.boundingBox();
    expect(buttonBox.width).toBeGreaterThanOrEqual(44);
    expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    const boxes = await page.locator('.squad-visual .core, .squad-visual .orbit-card').evaluateAll((elements) =>
      elements.map((element) => {
        const { top, bottom } = element.getBoundingClientRect();
        return { top, bottom };
      }),
    );
    for (let index = 1; index < boxes.length; index += 1) {
      expect(boxes[index].top - boxes[index - 1].bottom).toBeGreaterThanOrEqual(10);
    }
    await page.locator('.squad-visual').screenshot({ path: testInfo.outputPath(`mobile-graphic-${width}.png`) });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toHaveAccessibleName('Close menu');
    await page.getByRole('navigation').getByRole('link', { name: 'Services', exact: true }).click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toHaveAccessibleName('Open menu');
    expect(await page.locator('.site-header').evaluate((header) => getComputedStyle(header).backgroundColor)).toBe('rgb(255, 255, 255)');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await menu.click();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  }
});

test('hero diagram stays contained and never overlaps at tablet and desktop breakpoints', async ({ page }, testInfo) => {
  for (const width of [801, 820, 960, 961, 1024, 1050, 1051, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const diagram = await page.locator('.squad-visual').boundingBox();
    const boxes = await page.locator('.squad-visual .core, .squad-visual .orbit-card').evaluateAll((elements) =>
      elements.map((element) => {
        const { left, right, top, bottom } = element.getBoundingClientRect();
        return { left, right, top, bottom };
      }),
    );
    for (const box of boxes) {
      expect(box.left).toBeGreaterThanOrEqual(diagram.x + 10);
      expect(box.right).toBeLessThanOrEqual(diagram.x + diagram.width - 10);
      expect(box.top).toBeGreaterThanOrEqual(diagram.y + 10);
      expect(box.bottom).toBeLessThanOrEqual(diagram.y + diagram.height - 10);
    }
    for (let first = 0; first < boxes.length; first += 1) {
      for (let second = first + 1; second < boxes.length; second += 1) {
        const a = boxes[first];
        const b = boxes[second];
        expect(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top).toBe(true);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (width === 1024 || width === 1280) {
      await page.locator('.hero').screenshot({ path: testInfo.outputPath(`hero-${width}.png`) });
    }
  }
});

test('blank enquiries are rejected and can be corrected', async ({ page }) => {
  let requests = 0;
  await page.route('https://formsubmit.co/**', (route) => {
    requests += 1;
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Test intercepted submission</h1>' });
  });
  await page.goto('/');
  await page.getByLabel('Your name').fill('   ');
  await page.getByLabel('Work email').fill('visitor@example.com');
  await page.getByLabel('Tell us a little more').fill('   ');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  expect(requests).toBe(0);
  expect(await page.getByLabel('Your name').evaluate((input) => input.validity.valid)).toBe(false);
  await page.getByLabel('Your name').fill('Visitor');
  await page.getByLabel('Tell us a little more').fill('A service enquiry');
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.getByRole('heading', { name: 'Test intercepted submission' })).toBeVisible();
  expect(requests).toBe(1);
});

test('consent and a valid email are required before submission', async ({ page }) => {
  let requests = 0;
  await page.route('https://formsubmit.co/**', (route) => {
    requests += 1;
    return route.abort();
  });
  await page.goto('/');
  await page.getByLabel('Your name').fill('Test Visitor');
  await page.getByLabel('Work email').fill('invalid-email');
  await page.getByLabel('Tell us a little more').fill('A service enquiry.');
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  expect(await page.getByLabel('Work email').evaluate((input) => input.validity.valid)).toBe(false);
  await page.getByLabel('Work email').fill('visitor@example.com');
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  expect(await page.getByRole('checkbox').evaluate((input) => input.validity.valid)).toBe(false);
  expect(requests).toBe(0);
});

test('form can submit without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route('https://formsubmit.co/**', (route) => route.fulfill({
    status: 200, contentType: 'text/html', body: '<h1>Test intercepted submission</h1>',
  }));
  await page.goto('http://127.0.0.1:4173/');
  await page.getByLabel('Your name').fill('Test Visitor');
  await page.getByLabel('Work email').fill('visitor@example.com');
  await page.getByLabel('Tell us a little more').fill('An enquiry without JavaScript.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.getByRole('heading', { name: 'Test intercepted submission' })).toBeVisible();
  await context.close();
});

test('thank-you page is built and usable on mobile without claiming inbox delivery', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/thanks.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Thank you');
  await expect(page.getByText('This page does not independently confirm inbox delivery.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore NeoSquad' })).toHaveAttribute('href', './');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
