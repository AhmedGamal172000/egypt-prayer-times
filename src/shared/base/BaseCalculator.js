/**
 * Abstract base class for prayer time calculators.
 * @abstract
 */
export class BaseCalculator {
  constructor() {
    if (new.target === BaseCalculator) {
      throw new TypeError('Cannot instantiate abstract BaseCalculator directly');
    }
  }

  /**
   * Calculate prayer times for a given date and coordinates.
   * @abstract
   * @param {Date} date
   * @param {number} lat
   * @param {number} lng
   * @param {Object} options - Calculation options (method, madhab, etc.)
   * @returns {Object} Prayer times object with Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha
   */
  calculate(date, lat, lng, _options = {}) {
    throw new Error('Calculator must implement calculate()');
  }
}
