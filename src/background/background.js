import { prayerEngine } from '../shared/prayerEngine.js';
import { store } from '../shared/store.js';
import { ALARMS, DEFAULT_SETTINGS, PRAYER_NAMES } from '../shared/config.js';
import { NotificationManager } from './NotificationManager.js';
import { getTimeRemaining } from '../shared/utils.js';

const notificationManager = new NotificationManager({ engine: prayerEngine, store });

/**
 * Initialize background service worker.
 */
async function initBackground() {
  await notificationManager.init();
  notificationManager.enable();
  await prayerEngine.init();
  await refreshPrayerTimes();
  setupAlarms();
}

/**
 * Set up chrome.alarms for daily sync and minute tick.
 */
function setupAlarms() {
  chrome.alarms.create(ALARMS.DAILY_SYNC, {
    when: getNextSyncTime().getTime(),
    periodInMinutes: 60 * 24
  });
  chrome.alarms.create(ALARMS.MINUTE_TICK, { periodInMinutes: 1 });
  chrome.alarms.create(ALARMS.HOURLY_REFRESH, { periodInMinutes: 60 });

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARMS.DAILY_SYNC) {
      await refreshPrayerTimes();
    } else if (alarm.name === ALARMS.HOURLY_REFRESH) {
      await refreshPrayerTimes();
    } else if (alarm.name === ALARMS.MINUTE_TICK) {
      await updateBadge();
      await scheduleNotifications();
    } else if (alarm.name.startsWith('prayer-')) {
      const prayerName = alarm.name.replace('prayer-', '');
      await notificationManager.showNotification(prayerName);
    }
  });
}

/**
 * Calculate next 3:00 AM sync time.
 * @returns {Date}
 */
function getNextSyncTime() {
  const now = new Date();
  const sync = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ALARMS.SYNC_HOUR, ALARMS.SYNC_MINUTE, 0);
  if (sync.getTime() <= now.getTime()) {
    sync.setDate(sync.getDate() + 1);
  }
  return sync;
}

/**
 * Refresh prayer times from API or fallback.
 */
async function refreshPrayerTimes() {
  try {
    await prayerEngine.refresh();
    await scheduleNotifications();
    await updateBadge();
  } catch (e) {
    console.error('[Background] Refresh failed:', e);
  }
}

/**
 * Update badge with minutes to next prayer.
 */
async function updateBadge() {
  try {
    const next = await prayerEngine.getNextPrayer();
    if (!next) {
      chrome.action.setBadgeText({ text: '' });
      return;
    }
    const remaining = getTimeRemaining(next.time);
    if (!remaining) {
      chrome.action.setBadgeText({ text: next.name.slice(0, 3) });
      return;
    }
    let badgeText = '';
    if (remaining.hours > 0) {
      badgeText = `${remaining.hours}h`;
    } else {
      badgeText = `${remaining.minutes}m`;
    }
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: '#0d6efd' });
  } catch (e) {
    console.error('[Background] Badge update failed:', e);
  }
}

/**
 * Schedule notifications for upcoming prayers.
 */
async function scheduleNotifications() {
  try {
    notificationManager.cancelAll();
    const data = await prayerEngine.getToday();
    if (!data || !data.times) {return;}
    const now = new Date();
    for (const name of PRAYER_NAMES) {
      const time = data.times[name];
      if (time && time > now) {
        notificationManager.schedule(name, time);
      }
    }
  } catch (e) {
    console.error('[Background] Schedule notifications failed:', e);
  }
}

/**
 * Listen for messages from popup/options.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.type === 'GET_TODAY') {
        const data = await prayerEngine.getToday();
        sendResponse({ success: true, data });
      } else if (message.type === 'GET_NEXT_PRAYER') {
        const next = await prayerEngine.getNextPrayer();
        sendResponse({ success: true, data: next });
      } else if (message.type === 'REFRESH_TIMES') {
        const data = await prayerEngine.refresh();
        sendResponse({ success: true, data });
      } else if (message.type === 'GET_SETTINGS') {
        const settings = await store.get('settings', DEFAULT_SETTINGS);
        sendResponse({ success: true, data: settings });
      } else if (message.type === 'SAVE_SETTINGS') {
        await store.set('settings', { ...DEFAULT_SETTINGS, ...message.payload });
        await prayerEngine.refresh();
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (e) {
      sendResponse({ success: false, error: e.message });
    }
  })();
  return true; // keep channel open for async
});

chrome.runtime.onStartup.addListener(() => initBackground());
chrome.runtime.onInstalled.addListener(() => initBackground());

// Initialize immediately if already running
initBackground();
