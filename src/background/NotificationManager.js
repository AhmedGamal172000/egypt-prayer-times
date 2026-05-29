import { BaseNotification } from '../shared/base/BaseNotification.js';
import { t } from '../shared/translations.js';

/**
 * Extensible notification manager for prayer time alerts.
 * Uses chrome.notifications for desktop alerts.
 */
export class NotificationManager extends BaseNotification {
  constructor(dependencies = {}) {
    super('NotificationManager', dependencies);
    this.scheduledAlarms = new Set();
  }

  async init() {
    // Clear old alarms on init
    const alarms = await chrome.alarms.getAll();
    for (const alarm of alarms) {
      if (alarm.name.startsWith('prayer-')) {
        await chrome.alarms.clear(alarm.name);
      }
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
    this.cancelAll();
  }

  /**
   * Schedule a notification for a prayer.
   * @param {string} prayerName
   * @param {Date} time
   */
  schedule(prayerName, time) {
    if (!this.isEnabled) {return;}
    const alarmName = `prayer-${prayerName}`;
    const when = time.getTime();
    // Only schedule if in the future
    if (when <= Date.now()) {return;}

    chrome.alarms.create(alarmName, { when });
    this.scheduledAlarms.add(alarmName);
  }

  /**
   * Cancel all prayer alarms.
   */
  cancelAll() {
    for (const name of this.scheduledAlarms) {
      chrome.alarms.clear(name);
    }
    this.scheduledAlarms.clear();
  }

  /**
   * Show a chrome notification for a prayer.
   * @param {string} prayerName
   */
  async showNotification(prayerName) {
    // Get user's language preference from storage; fallback to system locale
    let lang = 'en';
    try {
      const store = this.dependencies.store;
      const settings = await store.get('settings', {});
      lang = settings.language || 'en';
    } catch {
      // fallback stays 'en'
    }
    const title = t('extName', lang);
    const prayerLocalized = t(prayerName, lang);
    const message = t('NotificationMessage', lang, prayerLocalized);
    await chrome.notifications.create(`prayer-alert-${prayerName}-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'assets/icons/icon128.png',
      title,
      message,
      priority: 1
    });
  }
}
