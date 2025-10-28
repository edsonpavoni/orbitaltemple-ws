import { test, expect } from '@playwright/test';

test.describe('Send A Name Journey', () => {
  test('should complete full send-a-name journey with animations', async ({ page }) => {
    // Navigate to send-a-name page
    await page.goto('http://localhost:4325/send-a-name');
    await page.waitForLoadState('networkidle');

    // Step 1: Think of a name - breathing animation (10 seconds)
    await expect(page.locator('h1:has-text("think of a name")')).toBeVisible();
    await expect(page.locator('text=a being you want to honor, cherish, celebrate.')).toBeVisible();
    await expect(page.locator('text=breath, I invite you,')).toBeVisible();

    // Wait for timer to complete (3 seconds for testing) plus a bit extra
    await page.waitForTimeout(3500);

    // Step 2: After timer - should show name input directly
    await expect(page.locator('h1:has-text("now, type that name")')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('text=it will rise to the Orbital Temple in space.')).toBeVisible();

    // Type a name - fill will automatically focus (simulates opening keyboard)
    const nameInput = page.locator('input[type="text"]');
    await nameInput.fill('Edson Pavoni');

    // Wait for button to appear
    await page.waitForTimeout(300);

    // Find the "let it ascend" button (displayed as small caps)
    const nameSubmitButton = page.locator('button:has-text("let it ascend")');
    await expect(nameSubmitButton).toBeVisible({ timeout: 3000 });

    // Click to proceed to email
    await nameSubmitButton.click();

    // Step 3: Email input page
    await expect(page.locator('h1:has-text("type your email")')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('text=so you get a message when the name ascends.')).toBeVisible();

    // Type email - fill will automatically focus (simulates opening keyboard)
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');

    // Wait for button to appear
    await page.waitForTimeout(300);

    // Find the "it is done" button (displayed as small caps)
    const emailSubmitButton = page.locator('button:has-text("it is done")');
    await expect(emailSubmitButton).toBeVisible({ timeout: 3000 });

    // Click to complete
    await emailSubmitButton.click();

    // Step 4: Success page with dome
    await expect(page.locator('text=is now queued for ascension')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('text=serving the same impulse as our ancestors,')).toBeVisible();

    // Verify the name appears in the success message
    await expect(page.locator('text=The name Edson Pavoni')).toBeVisible();
  });

  test('should show audio icons on all pages', async ({ page }) => {
    await page.goto('http://localhost:4325/send-a-name');
    await page.waitForLoadState('networkidle');

    // Check audio icon is present (has polygon for speaker icon)
    const audioIcon = page.locator('button').filter({ has: page.locator('svg polygon') });
    await expect(audioIcon).toBeVisible();
  });
});
