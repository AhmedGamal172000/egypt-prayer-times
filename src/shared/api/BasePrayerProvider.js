import { BaseAPIProvider } from '../base/BaseAPIProvider.js';

/**
 * Abstract base class for prayer time data providers.
 * @abstract
 */
export class BasePrayerProvider extends BaseAPIProvider {
  constructor() {
    super();
    if (new.target === BasePrayerProvider) {
      throw new TypeError('Cannot instantiate abstract BasePrayerProvider directly');
    }
  }

  /**
   * Fetch monthly prayer times.
   * @abstract
   * @param {string} city
   * @param {string} country
   * @param {number} method - Calculation method ID
   * @param {Object} options - Additional options (madhab, etc.)
   * @returns {Promise<Object[]>} Array of daily prayer data for the month
   */
  async fetchMonthly(city, country, method, _options = {}) {
    throw new Error('Provider must implement fetchMonthly()');
  }

  /**
   * Fetch daily prayer times.
   * @abstract
   * @param {string} city
   * @param {string} country
   * @param {number} method
   * @param {Object} options
   * @returns {Promise<Object>} Single day prayer data
   */
  async fetchDaily(city, country, method, _options = {}) {
    throw new Error('Provider must implement fetchDaily()');
  }
}
