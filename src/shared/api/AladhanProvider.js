import { BasePrayerProvider } from './BasePrayerProvider.js';
import { API_CONFIG } from '../config.js';

/**
 * Aladhan.com API provider for prayer times.
 */
export class AladhanProvider extends BasePrayerProvider {
  constructor() {
    super();
    this.baseUrl = API_CONFIG.ALADHAN_BASE_URL;
    this.timeoutMs = API_CONFIG.DEFAULT_TIMEOUT_MS;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(`${this.baseUrl}/status`, { signal: controller.signal });
      clearTimeout(id);
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetch monthly prayer times.
   * @param {string} city
   * @param {string} country
   * @param {number} method
   * @param {Object} options
   * @returns {Promise<Object[]>}
   */
  async fetchMonthly(city, country, method, options = {}) {
    const now = new Date();
    const url = new URL(`${this.baseUrl}/calendarByCity/${now.getFullYear()}/${now.getMonth() + 1}`);
    url.searchParams.set('city', city);
    url.searchParams.set('country', country);
    url.searchParams.set('method', String(method));
    if (options.school) {url.searchParams.set('school', String(options.school));}

    const data = await this._fetchJson(url.toString());
    if (!data || !Array.isArray(data.data)) {
      throw new Error('Invalid monthly response from Aladhan');
    }
    return data.data.map(day => this._normalizeDay(day));
  }

  /**
   * Fetch daily prayer times.
   * @param {string} city
   * @param {string} country
   * @param {number} method
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async fetchDaily(city, country, method, options = {}) {
    const url = new URL(`${this.baseUrl}/timingsByCity/${Math.floor(Date.now() / 1000)}`);
    url.searchParams.set('city', city);
    url.searchParams.set('country', country);
    url.searchParams.set('method', String(method));
    if (options.school) {url.searchParams.set('school', String(options.school));}

    const data = await this._fetchJson(url.toString());
    if (!data || !data.data) {
      throw new Error('Invalid daily response from Aladhan');
    }
    return this._normalizeDay(data.data);
  }

  /**
   * @param {string} url
   * @returns {Promise<Object>}
   */
  async _fetchJson(url) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) {throw new Error(`HTTP ${response.status}`);}
      const json = await response.json();
      if (json.code !== 200) {throw new Error(`API error: ${json.status || json.code}`);}
      return json;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  /**
   * Normalize Aladhan day object to internal format.
   * @param {Object} day
   * @returns {Object}
   */
  _normalizeDay(day) {
    const timings = day.timings || {};
    const date = day.date || {};
    return {
      date: date.gregorian?.date || date.readable,
      hijri: date.hijri,
      times: {
        Fajr: this._parseTime(timings.Fajr),
        Sunrise: this._parseTime(timings.Sunrise),
        Dhuhr: this._parseTime(timings.Dhuhr),
        Asr: this._parseTime(timings.Asr),
        Maghrib: this._parseTime(timings.Maghrib),
        Isha: this._parseTime(timings.Isha)
      },
      meta: day.meta || {}
    };
  }

  /**
   * Parse "HH:MM (+03)" style time.
   * @param {string} timeStr
   * @returns {string} HH:MM
   */
  _parseTime(timeStr) {
    if (!timeStr) {return null;}
    const match = timeStr.match(/(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : timeStr.trim();
  }
}
