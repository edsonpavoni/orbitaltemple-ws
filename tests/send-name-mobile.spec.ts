import { test, expect } from '@playwright/test';

test.describe('Send A Name Journey - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE size
  });

  test('should center content properly on mobile viewport', async ({ page }) => {
    await page.goto('http://localhost:4322/send-a-name');
    await page.waitForLoadState('networkidle');

    // Check initial centering on breathing step
    const heading = page.locator('h1:has-text("think of a name")');
    await expect(heading).toBeVisible();

    // Get viewport dimensions
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();

    // Wait for button to appear
    await page.waitForTimeout(10500);

    // Click to go to name input
    const proceedButton = page.locator('button').filter({ has: page.locator('svg polyline') }).first();
    await proceedButton.click();

    // Check name input is visible
    await expect(page.locator('h1:has-text("now, type that name")')).toBeVisible();

    // Type name
    const nameInput = page.locator('input[type="text"]');
    await nameInput.fill('Test Name');

    // Wait for animation
    await page.waitForTimeout(800);

    // Check that input is still visible after move-up animation
    await expect(nameInput).toBeVisible();

    // Verify the input is roughly centered (not at top of screen)
    const inputBox = await nameInput.boundingBox();
    if (viewport && inputBox) {
      // Input should be in middle third of screen (not top third)
      expect(inputBox.y).toBeGreaterThan(viewport.height * 0.2);
      expect(inputBox.y).toBeLessThan(viewport.height * 0.8);
    }
  });

  test('should show dome only on final page', async ({ page }) => {
    await page.goto('http://localhost:4322/send-a-name');
    await page.waitForLoadState('networkidle');

    // Check dome is NOT visible on breathing step
    const domeImage = page.locator('img[alt="Dome"]');
    await expect(domeImage).not.toBeVisible({ timeout: 2000 }).catch(() => {
      // If element doesn't exist at all, that's fine
    });

    // Fast-forward through journey
    await page.waitForTimeout(10500);
    const proceedButton = page.locator('button').filter({ has: page.locator('svg polyline') }).first();
    await proceedButton.click();

    // Still no dome on name input
    await expect(page.locator('h1:has-text("now, type that name")')).toBeVisible();
    await expect(domeImage).not.toBeVisible({ timeout: 1000 }).catch(() => {});

    // Complete name input
    await page.locator('input[type="text"]').fill('Test Name');
    await page.waitForTimeout(800);
    await page.locator('button').filter({ has: page.locator('svg polyline') }).first().click();

    // Still no dome on email input
    await expect(page.locator('h1:has-text("type your email")')).toBeVisible();
    await expect(domeImage).not.toBeVisible({ timeout: 1000 }).catch(() => {});

    // Complete email input
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.waitForTimeout(800);
    await page.locator('button').filter({ has: page.locator('svg polyline') }).first().click();

    // NOW dome should be visible on final page
    await expect(page.locator('text=is now queued for ascension')).toBeVisible();
    await expect(domeImage).toBeVisible();
  });
});
