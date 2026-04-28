/**
 * Bot Link Builder
 * Генерирует ссылки на Telegram бота с параметрами
 */

export class BotLinkBuilder {
  constructor(botUsername) {
    this.botUsername = botUsername;
    this.baseUrl = `https://t.me/${botUsername}`;
  }

  /**
   * Создаёт ссылку с deep link параметрами
   * @param {Object} params - Параметры для deep link
   * @returns {string} - Полная ссылка на бота
   */
  buildLink(params = {}) {
    if (Object.keys(params).length === 0) {
      return this.baseUrl;
    }

    const paramString = new URLSearchParams(params).toString();
    return `${this.baseUrl}?start=${paramString}`;
  }

  /**
   * Создаёт ссылку для конкретного продукта
   * @param {string} productId - ID продукта
   * @param {Object} additionalParams - Дополнительные параметры
   * @returns {string} - Ссылка на бота с параметрами продукта
   */
  buildProductLink(productId, additionalParams = {}) {
    const params = {
      product: productId,
      ...additionalParams
    };
    return this.buildLink(params);
  }

  /**
   * Обновляет все ссылки на бота на странице
   * @param {string} selector - CSS селектор для ссылок
   */
  updateBotLinks(selector = 'a[href*="t.me"]') {
    const links = document.querySelectorAll(selector);

    links.forEach(link => {
      const productId = link.dataset.productId;
      if (productId) {
        link.href = this.buildProductLink(productId);
      }
    });
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const botUsername = document.body.dataset.botUsername;
  if (botUsername) {
    const linkBuilder = new BotLinkBuilder(botUsername);
    linkBuilder.updateBotLinks();
  }
});
