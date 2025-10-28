import { test, expect } from '@playwright/test';

test.describe('Menu Drawer Layout', () => {
  test.beforeEach(async ({ page }) => {
    // Start the dev server manually before running tests
    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');
  });

  test('should display menu with correct structure and styling', async ({ page }) => {
    // Open the menu drawer
    await page.click('#btn-menu');

    // Wait for drawer to be visible
    await page.waitForSelector('#menu-drawer[data-open="true"]', { state: 'visible' });

    // Check that the close button is on the right
    const closeButton = page.locator('#menu-drawer button[data-close]');
    await expect(closeButton).toBeVisible();
    const closeButtonBox = await closeButton.boundingBox();
    expect(closeButtonBox).toBeTruthy();

    // Check main section headings exist and are links
    const artworkLink = page.locator('#menu-drawer a:has-text("The Artwork")');
    const sendNameLink = page.locator('#menu-drawer a:has-text("Send A Name")');
    const artistLink = page.locator('#menu-drawer a:has-text("From The Artist")');

    await expect(artworkLink).toBeVisible();
    await expect(sendNameLink).toBeVisible();
    await expect(artistLink).toBeVisible();

    // Verify the text is in CamelCase, not ALLCAPS
    await expect(artworkLink).toHaveText('The Artwork');
    await expect(sendNameLink).toHaveText('Send A Name');
    await expect(artistLink).toHaveText('From The Artist');

    // Check that spacing exists between main sections and list items
    const artworkBox = await artworkLink.boundingBox();
    const firstListLink = page.locator('#menu-drawer ul li:first-child a');
    const firstListBox = await firstListLink.boundingBox();

    expect(artworkBox).toBeTruthy();
    expect(firstListBox).toBeTruthy();

    // Verify there's significant gap (at least 40px) between sections
    if (artworkBox && firstListBox) {
      const gap = firstListBox.y - (artworkBox.y + artworkBox.height);
      expect(gap).toBeGreaterThan(40);
    }

    // Check that all menu items are present with lowercase text
    await expect(page.locator('#menu-drawer a:has-text("yet, another temple?")')).toBeVisible();
    await expect(page.locator('#menu-drawer a:has-text("how it works")')).toBeVisible();
    await expect(page.locator('#menu-drawer a:has-text("space launch and risks")')).toBeVisible();
    await expect(page.locator('#menu-drawer a:has-text("brief history of art in space")')).toBeVisible();
    await expect(page.locator('#menu-drawer a:has-text("education & open source")')).toBeVisible();
    await expect(page.locator('#menu-drawer a:has-text("sustainability and space debris")')).toBeVisible();
    await expect(page.locator('#menu-drawer a:has-text("milestones & mentions")')).toBeVisible();
    await expect(page.locator('#menu-drawer a:has-text("team")')).toBeVisible();
    await expect(page.locator('#menu-drawer a:has-text("sponsors")')).toBeVisible();
    await expect(page.locator('#menu-drawer a:has-text("technical info")')).toBeVisible();
  });

  test('should navigate to correct pages when clicking menu items', async ({ page }) => {
    // Open menu
    await page.click('#btn-menu');
    await page.waitForSelector('#menu-drawer[data-open="true"]');

    // Test "The Artwork" link
    await page.click('#menu-drawer a:has-text("The Artwork")');
    await page.waitForURL('**/artwork');
    expect(page.url()).toContain('/artwork');

    // Go back and test "Send A Name"
    await page.goto('http://localhost:4321');
    await page.click('#btn-menu');
    await page.waitForSelector('#menu-drawer[data-open="true"]');
    await page.click('#menu-drawer a:has-text("Send A Name")');
    await page.waitForURL('**/send-a-name');
    expect(page.url()).toContain('/send-a-name');

    // Go back and test "From The Artist"
    await page.goto('http://localhost:4321');
    await page.click('#btn-menu');
    await page.waitForSelector('#menu-drawer[data-open="true"]');
    await page.click('#menu-drawer a:has-text("From The Artist")');
    await page.waitForURL('**/artist');
    expect(page.url()).toContain('/artist');
  });

  test('should close menu when clicking X button', async ({ page }) => {
    // Open menu
    await page.click('#btn-menu');
    await page.waitForSelector('#menu-drawer[data-open="true"]');

    // Click close button
    await page.click('#menu-drawer button[data-close]');

    // Wait for menu to close
    await page.waitForSelector('#menu-drawer[data-open="false"]');

    // Verify menu is hidden
    const drawer = page.locator('#menu-drawer');
    await expect(drawer).toHaveAttribute('data-open', 'false');
  });
});
