import './extendedView.css';
import { formatTime, formatGregorianDate, getTimeRemaining, formatCountdown } from '../shared/utils.js';
import { DEFAULT_SETTINGS } from '../shared/config.js';

let settings = { ...DEFAULT_SETTINGS };
let interval = null;

async function init() {
  settings = await getSettings();
  applyLanguageDirection();
  update();
  interval = setInterval(update, 1000);
}

async function getSettings() {
  try {
    const res = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    if (res?.success) {return { ...DEFAULT_SETTINGS, ...res.data };}
  } catch (e) {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

function applyLanguageDirection() {
  const html = document.documentElement;
  html.lang = settings.language === 'ar' ? 'ar' : 'en';
  html.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
}

function t(key) {
  try { return chrome.i18n.getMessage(key) || key; } catch { return key; }
}

async function update() {
  try {
    const now = new Date();
    const res = await chrome.runtime.sendMessage({ type: 'GET_NEXT_PRAYER' });
    if (!res?.success || !res.data) {return;}
    const { name, time } = res.data;
    const timeDate = new Date(time);
    const remaining = getTimeRemaining(timeDate);

    document.getElementById('label').textContent = t('NextPrayer');
    document.getElementById('prayer-name').textContent = t(name);
    document.getElementById('countdown').textContent = formatCountdown(remaining);
    document.getElementById('prayer-time').textContent = formatTime(timeDate, settings.timeFormat);
    document.getElementById('date').textContent = formatGregorianDate(now, settings.language === 'ar' ? 'ar-EG' : 'en-US');
  } catch (e) {
    console.error('[ExtendedView] update failed', e);
  }
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('beforeunload', () => {
  if (interval) {clearInterval(interval);}
});
