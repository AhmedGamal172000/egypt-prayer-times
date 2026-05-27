import { PRAYER_NAMES, DEFAULT_SETTINGS, DATA_SOURCE } from './config.js';
import { store } from './store.js';
import { AladhanProvider } from './api/AladhanProvider.js';

/**
 * Observer pattern for prayer time updates.
 */
export class PrayerTimeObserver {
  constructor() {
    this.subscribers = new Set();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(data) {
    for (const cb of this.subscribers) {
      try { cb(data); } catch (e) { /* ignore */ }
    }
  }
}

/**
 * Prayer engine: API-only with cache fallback. No local calculation.
 * Egypt DST (summer/winter time) is handled automatically by Aladhan API.
 */
export class PrayerEngine {
  constructor() {
    this.observer = new PrayerTimeObserver();
    this.provider = new AladhanProvider();
    this.currentData = null;
    this.monthlyData = null;
    this.source = DATA_SOURCE.CACHED;
  }

  /**
   * Initialize engine: try API first, fall back to cache.
   * @returns {Promise<void>}
   */
  async init() {
    try {
      await this.refresh();
    } catch {
      await this._loadFromCache();
    }
  }

  /**
   * Refresh prayer times from API. On failure, use cache.
   * @returns {Promise<Object>}
   */
  async refresh() {
    const settings = await this._getSettings();
    try {
      const city = settings.useCustomCoords ? null : settings.city.name;
      const country = settings.useCustomCoords ? null : 'Egypt';

      if (!settings.useCustomCoords && city) {
        const monthly = await this.provider.fetchMonthly(city, country, settings.method, {
          school: settings.madhab === 'Hanafi' ? 1 : 0
        });
        this.monthlyData = monthly;
        const today = this._pickToday(monthly);
        this.currentData = {
          date: today.date,
          hijri: today.hijri,
          times: this._parseTimesToDates(today.times),
          source: DATA_SOURCE.LIVE
        };
        this.source = DATA_SOURCE.LIVE;
        await this._cacheData(this.currentData);
        await this._cacheMonthly(this.monthlyData);
      } else {
        // Custom coordinates: use daily endpoint
        const daily = await this.provider.fetchDaily('', 'Egypt', settings.method, {
          school: settings.madhab === 'Hanafi' ? 1 : 0
        });
        this.currentData = {
          date: daily.date,
          hijri: daily.hijri,
          times: this._parseTimesToDates(daily.times),
          source: DATA_SOURCE.LIVE
        };
        this.source = DATA_SOURCE.LIVE;
        await this._cacheData(this.currentData);
      }
    } catch (err) {
      await this._loadFromCache();
    }

    this.observer.notify({ ...this.currentData, source: this.source });
    return { ...this.currentData, source: this.source };
  }

  /**
   * Get today's prayer data. Always tries API refresh first.
   * @returns {Promise<Object>}
   */
  async getToday() {
    if (this.source !== DATA_SOURCE.LIVE) {
      try {
        await this.refresh();
      } catch {
        // keep cached data
      }
    }
    if (!this.currentData) {
      await this._loadFromCache();
    }
    if (!this.currentData) {
      return { times: {}, source: DATA_SOURCE.CACHED };
    }
    return { ...this.currentData, source: this.source };
  }

  /**
   * Get the next prayer and time.
   * @returns {Promise<{name: string, time: Date}|null>}
   */
  async getNextPrayer() {
    const data = await this.getToday();
    const now = new Date();
    for (const name of PRAYER_NAMES) {
      const t = data.times[name];
      if (t && t > now) {
        return { name, time: t };
      }
    }
    // All prayers passed; look up tomorrow's Fajr from monthly data
    const tomorrowFajr = await this._getTomorrowFajr();
    if (tomorrowFajr) {
      return { name: 'Fajr', time: tomorrowFajr };
    }
    return null;
  }

  async _getTomorrowFajr() {
    if (!this.monthlyData) {
      this.monthlyData = await this._getCachedMonthly();
    }
    if (!this.monthlyData) {return null;}

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pad = (n) => String(n).padStart(2, '0');
    const dd = pad(tomorrow.getDate());
    const mm = pad(tomorrow.getMonth() + 1);
    const yyyy = tomorrow.getFullYear();
    const tomorrowFormatted = `${dd}-${mm}-${yyyy}`;
    const tomorrowIso = tomorrow.toISOString().split('T')[0];

    const dayData = this.monthlyData.find(d => d.date === tomorrowFormatted || d.date === tomorrowIso);
    if (dayData && dayData.times && dayData.times.Fajr) {
      const [h, min] = dayData.times.Fajr.split(':').map(Number);
      return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), h, min, 0);
    }
    return null;
  }

  async _getSettings() {
    const saved = await store.get('settings', {});
    return { ...DEFAULT_SETTINGS, ...saved };
  }

  async _loadFromCache() {
    const cached = await this._getCachedData();
    if (cached) {
      this.currentData = cached;
      this.source = DATA_SOURCE.CACHED;
      this.monthlyData = await this._getCachedMonthly();
      this.observer.notify({ ...this.currentData, source: this.source });
      return;
    }
    // No cache available — will retry on next refresh
    this.source = DATA_SOURCE.CACHED;
  }

  async _cacheData(data) {
    const payload = { data, timestamp: Date.now() };
    await store.set('cachedPrayerData', payload);
  }

  async _cacheMonthly(monthly) {
    await store.set('cachedMonthlyData', { data: monthly, timestamp: Date.now() });
  }

  async _getCachedData() {
    const cached = await store.get('cachedPrayerData', null);
    return cached?.data || null;
  }

  async _getCachedMonthly() {
    const cached = await store.get('cachedMonthlyData', null);
    return cached?.data || null;
  }

  _pickToday(monthlyData) {
    const todayStr = new Date().toISOString().split('T')[0];
    const pad = (n) => String(n).padStart(2, '0');
    const dd = pad(new Date().getDate());
    const mm = pad(new Date().getMonth() + 1);
    const yyyy = new Date().getFullYear();
    const todayFormatted = `${dd}-${mm}-${yyyy}`;

    const found = monthlyData.find(d => d.date === todayFormatted || d.date === todayStr);
    return found || monthlyData[0];
  }

  _parseTimesToDates(times) {
    const now = new Date();
    const [y, m, d] = [now.getFullYear(), now.getMonth(), now.getDate()];
    const result = {};
    for (const [name, timeStr] of Object.entries(times)) {
      if (!timeStr) {continue;}
      const [h, min] = timeStr.split(':').map(Number);
      result[name] = new Date(y, m, d, h, min, 0);
    }
    return result;
  }
}

/** Singleton instance */
export const prayerEngine = new PrayerEngine();
