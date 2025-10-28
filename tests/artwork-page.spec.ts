import { test, expect } from '@playwright/test';

test.describe('Artwork Page', () => {
  test('should display all content and images correctly', async ({ page }) => {
    // Navigate to artwork page
    await page.goto('http://localhost:4321/artwork');
    await page.waitForLoadState('networkidle');

    // Check main title
    await expect(page.locator('h1:has-text("The Artwork")')).toBeVisible();

    // Check introduction paragraphs
    await expect(page.locator('text=Orbital Temple is a satellite with an artistic mission')).toBeVisible();
    await expect(page.locator('text=Through technological means, anyone can send the name')).toBeVisible();

    // Check section headers
    await expect(page.locator('h2:has-text("The Sculpture")')).toBeVisible();
    await expect(page.locator('h2:has-text("The Antenna As A Public Sculpture")')).toBeVisible();

    // Check all 7 images are present
    const images = page.locator('.artwork-image img');
    await expect(images).toHaveCount(7);

    // Verify specific images load
    await expect(page.locator('img[src="/artwork/orbital_temple_sat1.png"]')).toBeVisible();
    await expect(page.locator('img[src="/artwork/EdsonPavoni_TemploOrbita_RiseNY1.png"]')).toBeVisible();
    await expect(page.locator('img[src="/artwork/EdsonPavoni_TemploOrbital_ClaraMarques.png"]')).toBeVisible();
    await expect(page.locator('img[src="/artwork/OrbitalTemple_fotoClaraMarques1.png"]')).toBeVisible();
    await expect(page.locator('img[src="/artwork/OrbitalTemple_fotoClaraMarques2.png"]')).toBeVisible();
    await expect(page.locator('img[src="/artwork/OrbitalTemple_fotoClaraMarques3.png"]')).toBeVisible();
    await expect(page.locator('img[src="/artwork/OrbitalTemple_Antena.png"]')).toBeVisible();

    // Check footer is present
    await expect(page.locator('.artwork-footer')).toBeVisible();
    await expect(page.locator('text=Orbital Temple is an artwork by Edson Pavoni')).toBeVisible();
  });

  test('should have proper styling from global.css', async ({ page }) => {
    await page.goto('http://localhost:4321/artwork');
    await page.waitForLoadState('networkidle');

    // Check page container has proper max-width
    const main = page.locator('.artwork-page');
    await expect(main).toHaveCSS('max-width', '600px');

    // Check title styling
    const title = page.locator('.artwork-title');
    await expect(title).toHaveCSS('font-size', '22px');
    await expect(title).toHaveCSS('font-weight', '700');

    // Check text styling
    const text = page.locator('.artwork-text').first();
    await expect(text).toHaveCSS('font-size', '16px');
  });
});
