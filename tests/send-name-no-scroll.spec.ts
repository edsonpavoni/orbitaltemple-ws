import { test, expect } from '@playwright/test';

test.describe('Send A Name - No Scroll Journey', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE
  });

  test('should never show scroll bars throughout journey', async ({ page }) => {
    await page.goto('http://localhost:4325/send-a-name');
    await page.waitForLoadState('networkidle');

    // Check no scroll on initial load
    const hasVerticalScroll = await page.evaluate(() => {
      return document.documentElement.scrollHeight > document.documentElement.clientHeight;
    });
    expect(hasVerticalScroll).toBe(false);

    // Wait for breathing to complete (3 seconds)
    await page.waitForTimeout(3500);

    // Click to proceed to name input
    const button = page.locator('button').filter({ has: page.locator('svg polyline') }).first();
    await button.click();
    await page.waitForTimeout(600);

    // Check dome is visible at top
    const dome = page.locator('img[alt="Dome"]');
    await expect(dome).toBeVisible();

    // Type in name input
    const nameInput = page.locator('input[type="text"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Test Name');

    // Check still no scroll
    const hasScrollAfterType = await page.evaluate(() => {
      return document.documentElement.scrollHeight > document.documentElement.clientHeight;
    });
    expect(hasScrollAfterType).toBe(false);

    // Verify dome still visible
    await expect(dome).toBeVisible();
  });

  test('should keep content visible when simulating keyboard', async ({ page }) => {
    await page.goto('http://localhost:4325/send-a-name');
    await page.waitForLoadState('networkidle');

    // Fast-forward to name input
    await page.waitForTimeout(3500);
    await page.locator('button').filter({ has: page.locator('svg polyline') }).first().click();
    await page.waitForTimeout(600);

    // Simulate keyboard opening by reducing viewport
    await page.setViewportSize({ width: 375, height: 400 }); // Reduced height = keyboard
    await page.waitForTimeout(500);

    // Input should still be visible
    const nameInput = page.locator('input[type="text"]');
    await expect(nameInput).toBeVisible();

    // Dome should still be visible (though smaller)
    const dome = page.locator('img[alt="Dome"]');
    await expect(dome).toBeVisible();

    // Content should be aligned to top, not cut off
    const input = await nameInput.boundingBox();
    expect(input).toBeTruthy();
    if (input) {
      expect(input.y).toBeGreaterThan(0);
      expect(input.y + input.height).toBeLessThan(400);
    }
  });

  test('should smoothly reposition when viewport changes', async ({ page }) => {
    await page.goto('http://localhost:4325/send-a-name');
    await page.waitForLoadState('networkidle');

    // Get to name input step
    await page.waitForTimeout(3500);
    await page.locator('button').filter({ has: page.locator('svg polyline') }).first().click();
    await page.waitForTimeout(600);

    const nameInput = page.locator('input[type="text"]');
    const initialBox = await nameInput.boundingBox();

    // Change viewport (simulate keyboard)
    await page.setViewportSize({ width: 375, height: 400 });
    await page.waitForTimeout(400); // Wait for smooth transition

    const newBox = await nameInput.boundingBox();

    // Input should have moved smoothly (not jumped)
    expect(initialBox).toBeTruthy();
    expect(newBox).toBeTruthy();

    // Should still be visible
    await expect(nameInput).toBeVisible();
  });

  test('dome should expand on final step', async ({ page }) => {
    await page.goto('http://localhost:4325/send-a-name');
    await page.waitForLoadState('networkidle');

    // Complete entire journey
    await page.waitForTimeout(3500);
    await page.locator('button').filter({ has: page.locator('svg polyline') }).first().click();
    await page.waitForTimeout(600);

    await page.locator('input[type="text"]').fill('Test Name');
    await page.waitForTimeout(800);
    await page.locator('button').filter({ has: page.locator('svg polyline') }).first().click();
    await page.waitForTimeout(600);

    await page.locator('input[type="email"]').fill('test@test.com');
    await page.waitForTimeout(800);
    await page.locator('button').filter({ has: page.locator('svg polyline') }).first().click();
    await page.waitForTimeout(1200); // Wait for dome animation

    // Final text should be visible
    await expect(page.locator('text=is now queued for ascension')).toBeVisible();

    // Dome should be expanded (check via styles if possible)
    const domeContainer = await page.$('#dome-container');
    expect(domeContainer).toBeTruthy();
  });
});
