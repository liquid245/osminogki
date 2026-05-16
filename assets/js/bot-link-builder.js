/**
 * Bot Link Builder
 * Генерирует ссылки на Telegram бота с параметрами
 */

const DEFAULT_BOT_USERNAME = 'osminogki_montessori_bot';
const PRODUCT_IDS_BY_PATH = {
  '/summer-camp/': 'summer_camp_2026'
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

  buildPayload(productId, tariff, utmParams = {}) {
    const payloadParts = {
      product_id: this.normalizeValue(productId),
      tariff: tariff ? this.normalizeValue(tariff) : '',
      utm_source: this.normalizeValue(utmParams.utm_source),
      utm_campaign: this.normalizeValue(utmParams.utm_campaign)
    };

    Object.entries(FIELD_PATTERNS).forEach(([key, pattern]) => {
      if (key === 'tariff') return;
      if (!pattern.test(payloadParts[key])) {
        throw new Error(`Invalid deep link ${key}`);
      }
    });

    let payload = payloadParts.product_id;
    if (payloadParts.tariff) {
      payload += `__${payloadParts.tariff}`;
    }
    payload += `__${payloadParts.utm_source}__${payloadParts.utm_campaign}`;
    if (payload.length > PAYLOAD_LIMIT) {
      throw new Error('Telegram deep link payload exceeds 64 characters');
    }

    return payload;
  }

  buildLink(productId, tariff, utmParams = {}) {
    return `${this.baseUrl}?start=${this.buildPayload(productId, tariff, utmParams)}`;
  }

  updateBotLinks(selector = 'a[href*="t.me"][data-product-id]') {
    const links = document.querySelectorAll(selector);
    const pageProductId = document.body.dataset.productId || PRODUCT_IDS_BY_PATH[window.location.pathname];
    const utmHandler = window.utmHandler;
    const currentUrlParams = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    const utmParams = utmHandler
      ? { ...utmHandler.getSavedUTMParams(), ...utmHandler.getUTMParams(), ...currentUrlParams }
      : currentUrlParams;

    links.forEach(link => {
      const productId = link.dataset.productId || pageProductId;
      const tariff = link.dataset.tariff || null;
      const mode = link.dataset.mode || null;
      if (productId) {
        if (mode === 'faq') {
          link.href = `${this.baseUrl}?start=${productId}_faq`;
        } else if (mode === 'reg') {
          link.href = `${this.baseUrl}?start=${productId}_reg`;
        } else {
          link.href = this.buildLink(productId, tariff, utmParams);
        }
      }
    });
  }
}

// Задача: TASK-008, TASK-037
document.addEventListener('DOMContentLoaded', () => {
  const botUsername = document.body.dataset.botUsername || DEFAULT_BOT_USERNAME;
  const linkBuilder = new BotLinkBuilder(botUsername);
  linkBuilder.updateBotLinks();
});
