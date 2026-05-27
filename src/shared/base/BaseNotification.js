import { BaseFeature } from './BaseFeature.js';

/**
 * Abstract base class for notification features.
 * Extend this for Adhan audio, pre-prayer alerts, etc.
 * @abstract
 */
export class BaseNotification extends BaseFeature {
  /**
   * @param {string} name
   * @param {Object} dependencies
   */
  constructor(name, dependencies = {}) {
    super(name, dependencies);
    if (new.target === BaseNotification) {
      throw new TypeError('Cannot instantiate abstract BaseNotification directly');
    }
  }

  /**
   * Schedule a notification for a specific prayer time.
   * @abstract
   * @param {string} prayerName - e.g., 'Fajr', 'Dhuhr'
   * @param {Date} time
   * @returns {void}
   */
  schedule(_prayerName, _time) {
    throw new Error(`Notification "${this.name}" must implement schedule()`);
  }

  /**
   * Cancel all scheduled notifications.
   * @abstract
   * @returns {void}
   */
  cancelAll() {
    throw new Error(`Notification "${this.name}" must implement cancelAll()`);
  }
}
