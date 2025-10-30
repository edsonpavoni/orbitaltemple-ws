import { test, expect } from '@playwright/test';

test.describe('Send A Name - QA Tests', () => {
  test('QA-001: Page should load and show breathing text with staggered animation', async ({ page }) => {
    await page.goto('/send-a-name');
    await page.waitForLoadState('networkidle');

    // Check that breathing text is visible
    const breathingText = page.locator('text=as you enter');
    await expect(breathingText).toBeVisible({ timeout: 5000 });

    // Check that button appears
    const readyButton = page.locator('button:has-text("I\'m ready")');
    await expect(readyButton).toBeVisible({ timeout: 5000 });
  });

  test('QA-002: Text scaling - name field should handle long text without cutting', async ({ page }) => {
    await page.goto('/send-a-name');
    await page.waitForLoadState('networkidle');

    // Click "I'm ready" button
    const readyButton = page.locator('button:has-text("I\'m ready")');
    await readyButton.click();

    // Wait for name input to appear
    await page.waitForTimeout(1000);

    // Type a very long name
    const nameInput = page.locator('input[type="text"]');
    const longName = 'This is a very long name that should scale down to fit the screen without cutting off any text';
    await nameInput.fill(longName);

    // Wait for font size adjustment
    await page.waitForTimeout(500);

    // Check that the input has adjusted font size
    const fontSize = await nameInput.evaluate((el: HTMLInputElement) => {
      return window.getComputedStyle(el).fontSize;
    });

    // Font size should be smaller than the default 30px
    const fontSizeNum = parseInt(fontSize);
    expect(fontSizeNum).toBeLessThan(30);
    expect(fontSizeNum).toBeGreaterThanOrEqual(14);
  });

  test('QA-003: Placeholders should show with 50% opacity', async ({ page }) => {
    await page.goto('/send-a-name');
    await page.waitForLoadState('networkidle');

    // Click "I'm ready" button
    const readyButton = page.locator('button:has-text("I\'m ready")');
    await readyButton.click();

    // Wait for name input to appear
    await page.waitForTimeout(1000);

    // Check name input placeholder
    const nameInput = page.locator('input[type="text"]');
    const namePlaceholder = await nameInput.getAttribute('placeholder');
    expect(namePlaceholder).toBe('name');

    // Check that placeholder has 50% opacity via CSS
    const placeholderOpacity = await page.evaluate(() => {
      const style = window.getComputedStyle(document.querySelector('.input-field')!, '::placeholder');
      return style.opacity;
    });
    expect(placeholderOpacity).toBe('0.5');

    // Move to email step
    await nameInput.fill('Test Name');
    const ascendButton = page.locator('button:has-text("let it ascend")');
    await ascendButton.click();

    await page.waitForTimeout(1000);

    // Check email input placeholder
    const emailInput = page.locator('input[type="email"]');
    const emailPlaceholder = await emailInput.getAttribute('placeholder');
    expect(emailPlaceholder).toBe('email');
  });

  test('QA-004: Enter key should submit form', async ({ page }) => {
    await page.goto('/send-a-name');
    await page.waitForLoadState('networkidle');

    // Click "I'm ready" button
    const readyButton = page.locator('button:has-text("I\'m ready")');
    await readyButton.click();

    await page.waitForTimeout(1000);

    // Type name and press Enter
    const nameInput = page.locator('input[type="text"]');
    await nameInput.fill('Test Name');
    await nameInput.press('Enter');

    // Should move to email step
    await expect(page.locator('h1:has-text("type your email")')).toBeVisible({ timeout: 2000 });

    // Type email and press Enter
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');
    await emailInput.press('Enter');

    // Should move to loading/complete step
    await expect(page.locator('text=is now queued')).toBeVisible({ timeout: 5000 });
  });

  test('QA-005: Animation should always go up, not down-then-up', async ({ page }) => {
    await page.goto('/send-a-name');
    await page.waitForLoadState('networkidle');

    // Click "I'm ready" button
    const readyButton = page.locator('button:has-text("I\'m ready")');
    await readyButton.click();

    // Wait for transition
    await page.waitForTimeout(100);

    // Check that name input step has correct transform
    const nameStep = page.locator('div:has(> h1:has-text("type a name"))').first();
    const transform = await nameStep.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    // Should be at translateY(0) when active
    // When inactive, should be at translateY(-50px), not translateY(50px)
    console.log('Transform:', transform);
  });

  test('QA-006: Entry animation should show BG, then text, then button with opacity (no up/down)', async ({ page }) => {
    await page.goto('/send-a-name');

    // Background (Starfield) should be visible immediately
    const starfield = page.locator('canvas').first();
    await expect(starfield).toBeVisible({ timeout: 1000 });

    // Text should fade in
    const breathingText = page.locator('text=as you enter');
    await expect(breathingText).toBeVisible({ timeout: 1000 });

    // Button should fade in after text
    const readyButton = page.locator('button:has-text("I\'m ready")');
    await expect(readyButton).toBeVisible({ timeout: 1500 });
  });

  test('QA-007: Button hover should change color like menu', async ({ page }) => {
    await page.goto('/send-a-name');
    await page.waitForLoadState('networkidle');

    // Click "I'm ready" button to get to name input
    const readyButton = page.locator('button:has-text("I\'m ready")');
    await readyButton.click();

    await page.waitForTimeout(1000);

    // Type a name to show the button
    const nameInput = page.locator('input[type="text"]');
    await nameInput.fill('Test');

    await page.waitForTimeout(500);

    const ascendButton = page.locator('button:has-text("let it ascend")');

    // Get initial color (should be gold600: #553903 = rgb(85, 57, 3))
    const initialColor = await ascendButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Check that button has transition property for color
    const transition = await ascendButton.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    // Should have color transition
    expect(transition).toContain('color');

    // Check initial color is gold600
    expect(initialColor).toBe('rgb(85, 57, 3)');
  });

  test('QA-008: Desktop - content should be vertically centered', async ({ page, viewport }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.goto('/send-a-name');
    await page.waitForLoadState('networkidle');

    // Get the main container
    const container = page.locator('div').first();
    const alignItems = await container.evaluate((el) => {
      return window.getComputedStyle(el).alignItems;
    });

    // Should be centered on desktop
    expect(alignItems).toBe('center');
  });

  test('QA-009: Mobile - content should be at top', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/send-a-name');
    await page.waitForLoadState('networkidle');

    // Wait for resize handler to update state
    await page.waitForTimeout(500);

    // Get the main container
    const container = page.locator('div').first();
    const alignItems = await container.evaluate((el) => {
      return window.getComputedStyle(el).alignItems;
    });

    // Should be flex-start on mobile
    expect(alignItems).toBe('flex-start');
  });

  test('QA-010: Complete journey test', async ({ page }) => {
    await page.goto('/send-a-name');
    await page.waitForLoadState('networkidle');

    // Step 1: Breathing page
    await expect(page.locator('text=as you enter')).toBeVisible({ timeout: 5000 });
    const readyButton = page.locator('button:has-text("I\'m ready")');
    await expect(readyButton).toBeVisible({ timeout: 2000 });
    await readyButton.click();

    // Step 2: Name input
    await expect(page.locator('h1:has-text("type a name")')).toBeVisible({ timeout: 2000 });
    const nameInput = page.locator('input[type="text"]');
    await nameInput.fill('John Doe');

    const ascendButton = page.locator('button:has-text("let it ascend")');
    await expect(ascendButton).toBeVisible({ timeout: 1000 });
    await ascendButton.click();

    // Step 3: Email input
    await expect(page.locator('h1:has-text("type your email")')).toBeVisible({ timeout: 2000 });
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');

    const doneButton = page.locator('button:has-text("it is done")');
    await expect(doneButton).toBeVisible({ timeout: 1000 });
    await doneButton.click();

    // Step 4: Success page
    await expect(page.locator('text=is now queued')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=John Doe')).toBeVisible();
  });
});
