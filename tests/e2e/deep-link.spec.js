const { test, expect } = require('@playwright/test');

// Задача: TASK-027
test.describe('Telegram deep link contract', () => {
  test('summer camp landing builds start payload from product_id and UTM params', async ({ page }) => {
    await page.goto('/summer-camp/?utm_source=yandex&utm_campaign=summer25', { waitUntil: 'domcontentloaded' });

    const links = page.locator('a[href^="https://t.me/osminogki_montessori_bot"]');
    await expect(links.first()).toHaveAttribute(
      'href',
      'https://t.me/osminogki_montessori_bot?start=summer_camp_2026__yandex__summer25'
    );
  });
});
