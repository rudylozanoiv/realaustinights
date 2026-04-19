import { test, expect } from '@playwright/test';

// Mobile-only regression checks for the iOS Safari ghost-click fix. The
// V8.1 header no longer has a hamburger — nav moved to BottomTabBar
// (covered in smoke.spec.ts).
test.describe('mobile', () => {
  test.skip(
    ({ isMobile }) => !isMobile,
    'Mobile-only controls — skipped on desktop',
  );

  test('tap mobile Sign Up — modal stays open (ghost-click guard)', async ({
    page,
  }) => {
    await page.goto('/');
    const signUp = page.locator('button:has-text("Sign Up"):visible').first();
    await expect(signUp).toBeVisible();
    await signUp.tap();
    await page.waitForTimeout(500);
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
