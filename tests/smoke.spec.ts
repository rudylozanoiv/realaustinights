import { test, expect } from '@playwright/test';

test('homepage loads and shows the feed heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  // Tonight is the default tab → "What's ⬆️ Tonight"
  await expect(
    page.getByRole('heading', { level: 2, name: /what's.*tonight/i }),
  ).toBeVisible();
});

test('Sign Up button opens the signup modal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign Up' }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  // Welcome step copy
  await expect(dialog.getByText('Sign up to post, comment, and upload.')).toBeVisible();
});

test('search bar filters feed venues (debounced)', async ({ page, isMobile }) => {
  await page.goto('/');
  // On mobile the search input lives inside the hamburger drawer — open it first.
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  // Pick the first visible search input (desktop nav on md+, drawer on mobile).
  const search = page.locator('input[type="search"]:visible').first();
  await search.fill('mohawk');
  await expect(page.getByRole('heading', { name: 'Mohawk ATX' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Barton Springs Pool' })).toHaveCount(0);
});

test('clicking View Details opens the venue detail', async ({ page, isMobile }) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: /view details for mohawk atx/i })
    .click();
  // Venue title appears either in the mobile modal or in the desktop right sidebar.
  const title = page.getByRole('heading', { level: 2, name: 'Mohawk ATX' });
  await expect(title).toBeVisible();
  if (isMobile) {
    // Modal role="dialog" should be present on mobile
    await expect(page.getByRole('dialog', { name: /mohawk atx/i })).toBeVisible();
  }
});

test('Weird / Funny / Cool label cycles', async ({ page }) => {
  await page.goto('/');
  const wfcSection = page.locator('#weird-funny-cool');
  await wfcSection.scrollIntoViewIfNeeded();
  const labelBtn = wfcSection.getByRole('button').first();
  const first = (await labelBtn.textContent())?.trim();
  // The label cycles every 1.5s. Poll until text changes or timeout.
  await expect
    .poll(async () => (await labelBtn.textContent())?.trim(), { timeout: 5000 })
    .not.toBe(first);
});

test('date tabs switch feed content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Today' }).click();
  await expect(
    page.getByRole('heading', { level: 2, name: /what's.*today/i }),
  ).toBeVisible();
  await page.getByRole('tab', { name: 'This Weekend' }).click();
  await expect(
    page.getByRole('heading', { level: 2, name: /what's.*weekend/i }),
  ).toBeVisible();
});
