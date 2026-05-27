import { PrayerTimes, CalculationMethod, Madhab, Coordinates } from 'adhan';
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
 * Prayer engine combining live API, cache, and local Adhan calculation.
 */
export class PrayerEngine {
  constructor() {
    this.observer = new PrayerTimeObserver();
    this.provider = new AladhanProvider();
    this.currentData = null;
    this.source = DATA_SOURCE.CALCULATED;
  }

  /**
   * Initialize engine: load cached data or calculate fallback.
   * @returns {Promise<void>}
   */
  async init() {
    const settings = await this._getSettings();
    await this._loadOrCalculate(settings);
  }

  /**
   * Refresh prayer times from API with fallback to cache/calculation.
   * @returns {Promise<Object>}
   */
  async refresh() {
    const settings = await this._getSettings();
    try {
      const city = settings.useCustomCoords ? null : settings.city.name;
      const country = settings.useCustomCoords ? null : 'Egypt';
      const lat = settings.useCustomCoords ? settings.customLat : settings.city.lat;
      const lng = settings.useCustomCoords ? settings.customLng : settings.city.lng;

      if (!settings.useCustomCoords && city) {
        const monthly = await this.provider.fetchMonthly(city, country, settings.method, {
          school: settings.madhab === 'Hanafi' ? 1 : 0
        });
        const today = this._pickToday(monthly);
        this.currentData = {
          date: today.date,
          hijri: today.hijri,
          times: this._parseTimesToDates(today.times),
          source: DATA_SOURCE.LIVE
        };
        this.source = DATA_SOURCE.LIVE;
        await this._cacheData(this.currentData);
      } else {
        this.currentData = this._calculateLocal(new Date(), lat, lng, settings);
        this.source = DATA_SOURCE.CALCULATED;
      }
    } catch (err) {
      const cached = await this._getCachedData();
      if (cached && this._isCacheValid(cached)) {
        this.currentData = cached;
        this.source = DATA_SOURCE.CACHED;
      } else {
        const { lat, lng } = await this._getCoords(settings);
        this.currentData = this._calculateLocal(new Date(), lat, lng, settings);
        this.source = DATA_SOURCE.CALCULATED;
      }
    }

    this.observer.notify({ ...this.currentData, source: this.source });
    return { ...this.currentData, source: this.source };
  }

  /**
   * Get today's prayer data without network call.
   * @returns {Promise<Object>}
   */
  async getToday() {
    if (!this.currentData) {
      await this.init();
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
    // All prayers passed; next is tomorrow Fajr
    const settings = await this._getSettings();
    const { lat, lng } = await this._getCoords(settings);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const calc = this._calculateLocal(tomorrow, lat, lng, settings);
    return { name: 'Fajr', time: calc.times['Fajr'] };
  }

  /**
   * Calculate times locally using Adhan JS.
   * @param {Date} date
   * @param {number} lat
   * @param {number} lng
   * @param {Object} settings
   * @returns {Object}
   */
  _calculateLocal(date, lat, lng, settings) {
    const coords = new Coordinates(lat, lng);
    let params = CalculationMethod.Other();
    // Map method ID to Adhan params where possible; default to Egyptian custom tuning
    params = this._applyMethodParams(params, settings.method);
    params.madhab = settings.madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

    const pt = new PrayerTimes(coords, date, params);
    return {
      date: date.toISOString().split('T')[0],
      hijri: null,
      times: {
        Fajr: pt.fajr,
        Sunrise: pt.sunrise,
        Dhuhr: pt.dhuhr,
        Asr: pt.asr,
        Maghrib: pt.maghrib,
        Isha: pt.isha
      },
      source: DATA_SOURCE.CALCULATED
    };
  }

  _applyMethodParams(params, methodId) {
    switch (methodId) {
      case 1: return CalculationMethod.MuslimWorldLeague();
      case 2: return CalculationMethod.NorthAmerica();
      case 3: return CalculationMethod.MoonSightCommittee();
      case 4: return CalculationMethod.UmmAlQura();
      case 5:
        // Egyptian General Authority
        params.fajrAngle = 19.5;
        params.ishaAngle = 17.5;
        params.method = 'EgyptianGeneralAuthority';
        return params;
      default:
        params.fajrAngle = 19.5;
        params.ishaAngle = 17.5;
        return params;
    }
  }

  async _getSettings() {
    const saved = await store.get('settings', {});
    return { ...DEFAULT_SETTINGS, ...saved };
  }

  async _getCoords(settings) {
    if (settings.useCustomCoords && settings.customLat !== null && settings.customLat !== undefined && settings.customLng !== null && settings.customLng !== undefined) {
      return { lat: settings.customLat, lng: settings.customLng };
    }
    return { lat: settings.city.lat, lng: settings.city.lng };
  }

  async _loadOrCalculate(settings) {
    const cached = await this._getCachedData();
    if (cached && this._isCacheValid(cached)) {
      this.currentData = cached;
      this.source = DATA_SOURCE.CACHED;
      this.observer.notify({ ...this.currentData, source: this.source });
      return;
    }
    const { lat, lng } = await this._getCoords(settings);
    this.currentData = this._calculateLocal(new Date(), lat, lng, settings);
    this.source = DATA_SOURCE.CALCULATED;
    this.observer.notify({ ...this.currentData, source: this.source });
  }

  async _cacheData(data) {
    const payload = {
      data,
      timestamp: Date.now()
    };
    await store.set('cachedPrayerData', payload);
  }

  async _getCachedData() {
    const cached = await store.get('cachedPrayerData', null);
    return cached?.data || null;
  }

  _isCacheValid(cached) {
    if (!cached || !cached.timestamp) {return false;}
    const ageHours = (Date.now() - cached.timestamp) / (1000 * 60 * 60);
    return ageHours < 24;
  }

  _pickToday(monthlyData) {
    const todayStr = new Date().toISOString().split('T')[0];
    // Aladhan returns dd-MM-yyyy
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
