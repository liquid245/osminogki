/**
 * Bot Link Builder
 * Генерирует ссылки на Telegram бота с параметрами
 */

const DEFAULT_BOT_USERNAME = 'YourTelegramBot';
const PRODUCT_IDS_BY_PATH = {
  '/summer-camp/': 'summer_camp_2025',
  '/english-course/': 'english_course_2025'
};
const PAYLOAD_LIMIT = 64;
const FIELD_PATTERNS = {
  product_id: /^[a-z0-9_]{1,30}$/,
  utm_source: /^[a-z0-9_]{0,20}$/,
  utm_campaign: /^[a-z0-9_]{0,30}$/
};

export class BotLinkBuilder {
  constructor(botUsername = DEFAULT_BOT_USERNAME) {
    this.botUsername = botUsername;
    this.baseUrl = `https://t.me/${botUsername}`;
  }

  normalizeValue(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  buildPayload(productId, utmParams = {}) {
    const payloadParts = {
      product_id: this.normalizeValue(productId),
      utm_source: this.normalizeValue(utmParams.utm_source),
      utm_campaign: this.normalizeValue(utmParams.utm_campaign)
    };

    Object.entries(FIELD_PATTERNS).forEach(([key, pattern]) => {
      if (!pattern.test(payloadParts[key])) {
        throw new Error(`Invalid deep link ${key}`);
      }
    });

    const payload = `${payloadParts.product_id}__${payloadParts.utm_source}__${payloadParts.utm_campaign}`;
    if (payload.length > PAYLOAD_LIMIT) {
      throw new Error('Telegram deep link payload exceeds 64 characters');
    }

    return payload;
  }

  buildLink(productId, utmParams = {}) {
    return `${this.baseUrl}?start=${this.buildPayload(productId, utmParams)}`;
  }

  updateBotLinks(selector = 'a[href*="t.me"]') {
    const links = document.querySelectorAll(selector);
    const pageProductId = document.body.dataset.productId || PRODUCT_IDS_BY_PATH[window.location.pathname];
    const utmHandler = window.utmHandler;
    const currentUrlParams = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    const utmParams = utmHandler
      ? { ...utmHandler.getSavedUTMParams(), ...utmHandler.getUTMParams(), ...currentUrlParams }
      : currentUrlParams;

    links.forEach(link => {
      const productId = link.dataset.productId || pageProductId;
      if (productId) {
        link.href = this.buildLink(productId, utmParams);
      }
    });
  }
}

// Задача: TASK-008
document.addEventListener('DOMContentLoaded', () => {
  const botUsername = document.body.dataset.botUsername || DEFAULT_BOT_USERNAME;
  const linkBuilder = new BotLinkBuilder(botUsername);
  linkBuilder.updateBotLinks();
});
