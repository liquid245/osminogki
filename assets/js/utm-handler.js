/**
 * UTM Handler
 * Обрабатывает UTM параметры из URL и сохраняет их
 */

export class UTMHandler {
  constructor() {
    this.storageKey = 'utm_params';
    this.utmParams = this.getUTMParams();
  }

  /**
   * Получает UTM параметры из URL
   * @returns {Object} - Объект с UTM параметрами
   */
  getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    const utmParams = {};

    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = params.get(param);
      if (value) {
        utmParams[param] = value;
      }
    });

    return utmParams;
  }

  /**
   * Сохраняет UTM параметры в localStorage
   */
  saveUTMParams() {
    if (Object.keys(this.utmParams).length > 0) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.utmParams));
    }
  }

  /**
   * Получает сохранённые UTM параметры
   * @returns {Object} - Сохранённые UTM параметры
   */
  getSavedUTMParams() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : {};
  }

  /**
   * Добавляет UTM параметры к ссылке
   * @param {string} url - Базовая ссылка
   * @returns {string} - Ссылка с UTM параметрами
   */
  appendUTMParams(url) {
    const params = this.getSavedUTMParams();
    if (Object.keys(params).length === 0) {
      return url;
    }

    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });

    return urlObj.toString();
  }

  /**
   * Очищает сохранённые UTM параметры
   */
  clearUTMParams() {
    localStorage.removeItem(this.storageKey);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const utmHandler = new UTMHandler();
  utmHandler.saveUTMParams();
});
