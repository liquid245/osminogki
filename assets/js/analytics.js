/**
 * Analytics
 * Отслеживание событий на сайте
 */

export class Analytics {
  constructor() {
    this.events = [];
  }

  /**
   * Отслеживает просмотр страницы
   * @param {string} pageName - Название страницы
   * @param {Object} metadata - Дополнительные данные
   */
  trackPageView(pageName, metadata = {}) {
    const event = {
      type: 'page_view',
      page: pageName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...metadata
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  /**
   * Отслеживает клик по ссылке
   * @param {string} linkType - Тип ссылки
   * @param {string} target - Цель ссылки
   */
  trackClick(linkType, target) {
    const event = {
      type: 'click',
      linkType,
      target,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  /**
   * Отслеживает конверсию
   * @param {string} conversionType - Тип конверсии
   * @param {Object} data - Данные конверсии
   */
  trackConversion(conversionType, data = {}) {
    const event = {
      type: 'conversion',
      conversionType,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...data
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  /**
   * Отправляет событие (заглушка для реальной аналитики)
   * @param {Object} event - Событие для отправки
   */
  sendEvent(event) {
    // Здесь можно интегрировать с Google Analytics, Yandex Metrica и т.д.
    console.log('Analytics event:', event);

    // Пример интеграции с Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event.type, {
        event_category: event.type,
        event_label: event.page || event.linkType || event.conversionType,
        custom_data: event
      });
    }
  }

  /**
   * Получает все события
   * @returns {Array} - Массив событий
   */
  getEvents() {
    return this.events;
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const analytics = new Analytics();

  // Отслеживаем просмотр страницы
  const pageName = document.body.dataset.pageName || 'unknown';
  analytics.trackPageView(pageName);

  // Отслеживаем клики по ссылкам на бота
  document.querySelectorAll('a[href*="t.me"]').forEach(link => {
    link.addEventListener('click', (e) => {
      analytics.trackClick('telegram_bot', link.href);
    });
  });
});
