const { test, expect } = require('@playwright/test');

// Задача: TASK-008
test.describe('Telegram deep link contract', () => {
  test('summer camp landing builds start payload from product_id and UTM params', async ({ page }) => {
    await page.goto('/summer-camp/?utm_source=yandex&utm_campaign=summer25');

    const links = page.locator('a[href^="https://t.me/YourTelegramBot"]');
    await expect(links.first()).toHaveAttribute(
      'href',
      'https://t.me/YourTelegramBot?start=summer_camp_2025__yandex__summer25'
    );
  });

  test('english course landing keeps the same payload shape', async ({ page }) => {
    await page.goto('/english-course/?utm_source=vk&utm_campaign=english25');

    const links = page.locator('a[href^="https://t.me/YourTelegramBot"]');
    await expect(links.first()).toHaveAttribute(
      'href',
      'https://t.me/YourTelegramBot?start=english_course_2025__vk__english25'
    );
  });
});
