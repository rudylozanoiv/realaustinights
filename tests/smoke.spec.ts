import { test, expect } from '@playwright/test';

test('homepage loads and shows the feed heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  // Tonight is the default tab → "What's ⬆️ Tonight"
  await expect(
    page.getByRole('heading', { level: 2, name: /what's.*tonight/i }),
  ).toBeVisible();
});

test('Sign Up button opens the signup modal with tabs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign Up' }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('tab', { name: 'Sign Up' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(dialog.getByRole('tab', { name: 'Sign In' })).toHaveAttribute(
    'aria-selected',
    'false',
  );
  await expect(dialog.getByText(/Founding AustiNights/i)).toBeVisible();
});

test('Sign In tab shows simplified form', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign Up' }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('tab', { name: 'Sign In' }).click();
  await expect(dialog.getByRole('tab', { name: 'Sign In' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(dialog.getByText(/Welcome back/i)).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Sign In' })).toBeVisible();
  await expect(dialog.getByText(/Years in Austin/i)).toHaveCount(0);
  await expect(dialog.getByText(/I agree to the community/i)).toHaveCount(0);
});

test('search bar filters feed venues (debounced)', async ({ page }) => {
  await page.goto('/');
  // V8.1: search is always visible in the header — no drawer on mobile.
  const search = page.locator('input[type="search"]:visible').first();
  await search.fill('mohawk');
  await expect(page.getByRole('heading', { name: 'Mohawk ATX' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Barton Springs Pool' })).toHaveCount(0);
});

test('search Enter key submits without throwing', async ({ page }) => {
  await page.goto('/');
  const search = page.locator('input[type="search"]:visible').first();
  await search.fill('mohawk');
  // iOS Go / Enter key should submit the form. No page nav expected —
  // the form preventDefaults and scrolls to #feed.
  await search.press('Enter');
  await expect(page.getByRole('heading', { name: 'Mohawk ATX' })).toBeVisible();
});

test('search 🔍 submit button exists and is ≥44px', async ({ page }) => {
  await page.goto('/');
  const btn = page.getByRole('button', { name: 'Search' }).first();
  await expect(btn).toBeVisible();
  const box = await btn.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await btn.click();
  // No navigation; form is preventDefaulted.
  expect(page.url()).not.toContain('?q=');
});

test('clicking View Details opens the venue detail', async ({ page, isMobile }) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: /view details for mohawk atx/i })
    .click();
  const title = page.getByRole('heading', { level: 2, name: 'Mohawk ATX' });
  await expect(title).toBeVisible();
  if (isMobile) {
    await expect(page.getByRole('dialog', { name: /mohawk atx/i })).toBeVisible();
  }
});

test("St. Mary Cathedral View Details opens venue modal", async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  // Regression: previous image URL 404'd on iPhone. Card must still render,
  // View Details must fire, and the modal heading must show the venue name.
  await page
    .getByRole('button', { name: /view details for St\.?\s*Mary Cathedral/i })
    .click();
  await expect(
    page.getByRole('heading', { level: 2, name: 'St. Mary Cathedral' }),
  ).toBeVisible();
  if (isMobile) {
    await expect(
      page.getByRole('dialog', { name: /St\.?\s*Mary Cathedral/i }),
    ).toBeVisible();
  }
});

test('Weird / Funny / Cool label cycles', async ({ page }) => {
  await page.goto('/');
  const wfcSection = page.locator('#weird-funny-cool');
  await wfcSection.scrollIntoViewIfNeeded();
  // The cycling label is the first button inside the section heading.
  const labelBtn = wfcSection.getByRole('button').first();
  const first = (await labelBtn.textContent())?.trim();
  await expect
    .poll(async () => (await labelBtn.textContent())?.trim(), { timeout: 5000 })
    .not.toBe(first);
});

test('WFC explicit choice buttons lock category and open form', async ({ page }) => {
  await page.goto('/');
  const wfcSection = page.locator('#weird-funny-cool');
  await wfcSection.scrollIntoViewIfNeeded();
  // Explicit choice buttons: Weird / Funny / Cool. Emoji is aria-hidden so
  // the accessible name is just the word.
  const choose = wfcSection.getByRole('button', { name: 'Funny', exact: true });
  await choose.click();
  // Submit button with "Submit as Funny" OR "Sign in to submit" (logged out)
  await expect(
    wfcSection.getByRole('button', {
      name: /(submit as funny|sign in to submit)/i,
    }),
  ).toBeVisible();
});

test('WFC cancel button clears frozen state and returns to hero', async ({
  page,
}) => {
  await page.goto('/');
  const wfc = page.locator('#weird-funny-cool');
  await wfc.scrollIntoViewIfNeeded();

  // Lock a category → form opens.
  await wfc.getByRole('button', { name: 'Funny', exact: true }).click();
  const cancel = wfc.getByRole('button', { name: 'Cancel submission' });
  await expect(cancel).toBeVisible();
  await expect(
    wfc.getByRole('button', { name: /(submit as funny|sign in to submit)/i }),
  ).toBeVisible();

  // Tap cancel → form collapses, hero + 3 choice buttons remain.
  await cancel.click();
  await expect(cancel).toHaveCount(0);
  await expect(
    wfc.getByRole('button', { name: /(submit as funny|sign in to submit)/i }),
  ).toHaveCount(0);
  // 3 explicit choice buttons still present and unpressed.
  for (const label of ['Weird', 'Funny', 'Cool']) {
    const btn = wfc.getByRole('button', { name: label, exact: true });
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
  }
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

test('bottom tab bar appears on mobile and triggers business modal', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Bottom tab bar is mobile-only');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Bottom navigation' });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Home' })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Tonight' })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Gems' })).toBeVisible();
  await nav.getByRole('button', { name: 'Business' }).click();
  // BusinessPartnerModal opens
  await expect(
    page.getByRole('dialog', { name: /Become a Business Partner/i }),
  ).toBeVisible();
});

test('BottomTabBar anchors to viewport bottom across iPhone portrait + landscape', async ({
  page,
}) => {
  // Regression for V8.2.1: md:hidden (768px) stripped the nav in iPhone
  // landscape (844px). Now lg:hidden (1024px) keeps it on all mobile+tablet.
  const cases = [
    { label: 'iPhone 13 portrait', w: 390, h: 844 },
    { label: 'iPhone 13 landscape', w: 844, h: 390 },
    { label: 'iPhone 15 Pro Max portrait', w: 430, h: 932 },
  ];
  for (const c of cases) {
    await page.setViewportSize({ width: c.w, height: c.h });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Bottom navigation' });
    await expect(nav, `nav visible @ ${c.label}`).toBeVisible();
    const box = await nav.boundingBox();
    expect(box, `bbox @ ${c.label}`).not.toBeNull();
    // Bar must sit flush against the viewport bottom (bottom edge at h).
    expect(
      Math.round((box!.y + box!.height) - c.h),
      `bottom edge @ ${c.label}`,
    ).toBeLessThanOrEqual(1);
    // Height reasonable (≥60px + maybe safe-area).
    expect(box!.height, `height @ ${c.label}`).toBeGreaterThanOrEqual(60);
    // Full width.
    expect(Math.round(box!.width), `width @ ${c.label}`).toBe(c.w);
  }
});

test('QuePasa photo tap opens fullscreen modal', async ({ page }) => {
  await page.goto('/');
  const quePasa = page.locator('#que-pasa');
  await quePasa.scrollIntoViewIfNeeded();
  await quePasa.getByRole('button', { name: /Open .* fullscreen/i }).click();
  // Fullscreen modal is present with close button
  const modal = page.getByRole('dialog').filter({ hasText: /swipe for more/i });
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Close' }).click();
  await expect(modal).toHaveCount(0);
});

test('Barkingham pill in PupperWeekly opens venue detail', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const pupper = page.locator('#pupper');
  await pupper.scrollIntoViewIfNeeded();
  const pill = pupper.getByRole('button', {
    name: /Open Barkingham Place venue details/i,
  });
  await expect(pill).toBeVisible();
  await pill.click();
  // On mobile a dialog is used; on desktop the detail card renders in the
  // right sidebar. Either way the venue name appears as a level-2 heading.
  await expect(
    page.getByRole('heading', { level: 2, name: 'Barkingham Place' }),
  ).toBeVisible();
  if (isMobile) {
    await expect(
      page.getByRole('dialog', { name: /Barkingham Place/i }),
    ).toBeVisible();
  }
});

test('Comedy card expands on tap, Tickets link stays external', async ({
  page,
}) => {
  await page.goto('/');
  const comedy = page.locator('#comedy');
  await comedy.scrollIntoViewIfNeeded();

  // First card is Joe Pera at Cap City — tap to expand.
  const card = comedy.getByRole('button', {
    name: /Open details for Joe Pera/i,
  });
  await card.click();
  await expect(
    comedy.getByRole('heading', { level: 3, name: /Joe Pera: Soft Thoughts Tour/i }),
  ).toBeVisible();

  // Tickets link must keep target=_blank and NOT toggle expansion again.
  const tickets = comedy
    .getByRole('link', { name: /Tickets →/i })
    .first();
  await expect(tickets).toHaveAttribute('target', '_blank');
  await expect(tickets).toHaveAttribute('href', /capcitycomedy\.com/);
});
