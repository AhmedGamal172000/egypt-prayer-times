import './popup.css';
import { PRAYER_NAMES, DATA_SOURCE, DEFAULT_SETTINGS } from '../shared/config.js';
import { formatTime, formatGregorianDate, formatHijriDate, getTimeRemaining, formatCountdown } from '../shared/utils.js';

let settings = { ...DEFAULT_SETTINGS };
let clockInterval = null;
let countdownInterval = null;

async function init() {
  settings = await getSettings();
  applyLanguageDirection();
  await render();
  startClock();
  startCountdown();
  setupListeners();
}

async function getSettings() {
  try {
    const res = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    if (res?.success) {return { ...DEFAULT_SETTINGS, ...res.data };}
  } catch (e) {
    console.error('[Popup] getSettings failed', e);
  }
  return { ...DEFAULT_SETTINGS };
}

function applyLanguageDirection() {
  const html = document.documentElement;
  html.lang = settings.language === 'ar' ? 'ar' : 'en';
  html.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
}

function t(key) {
  try {
    return chrome.i18n.getMessage(key) || key;
  } catch {
    return key;
  }
}

function setupListeners() {
  document.getElementById('btn-settings').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  document.getElementById('btn-expand').addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('extendedView.html'),
      type: 'popup',
      width: 500,
      height: 360
    });
  });
}

function startClock() {
  const el = document.getElementById('current-time');
  const dateEl = document.getElementById('current-date');
  const tick = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString(settings.language === 'ar' ? 'ar-EG' : 'en-US', { hour12: settings.timeFormat === '12h' });
    dateEl.textContent = `${formatGregorianDate(now, settings.language === 'ar' ? 'ar-EG' : 'en-US')} · ${formatHijriDate(now)}`;
  };
  tick();
  clockInterval = setInterval(tick, 1000);
}

function startCountdown() {
  const tick = async () => {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'GET_NEXT_PRAYER' });
      if (!res?.success || !res.data) {return;}
      const { name, time } = res.data;
      const timeDate = time instanceof Date ? time : new Date(time);
      const remaining = getTimeRemaining(timeDate);

      document.getElementById('next-prayer-name').textContent = t(name);
      document.getElementById('next-prayer-countdown').textContent = formatCountdown(remaining);
      document.getElementById('next-prayer-time').textContent = formatTime(timeDate, settings.timeFormat);
    } catch (e) {
      // silent
    }
  };
  tick();
  countdownInterval = setInterval(tick, 1000);
}

function rehydrateTimes(data) {
  if (!data || !data.times) {return data;}
  const fixed = { ...data, times: {} };
  for (const [name, val] of Object.entries(data.times)) {
    fixed.times[name] = val instanceof Date ? val : new Date(val);
  }
  return fixed;
}

async function render() {
  try {
    const res = await chrome.runtime.sendMessage({ type: 'GET_TODAY' });
    if (!res?.success || !res.data) {return;}
    const data = rehydrateTimes(res.data);
    const now = new Date();

    renderPrayerList(data.times, now);
    renderStatus(data.source);
  } catch (e) {
    console.error('[Popup] render failed', e);
  }
}

function renderPrayerList(times, now) {
  const container = document.getElementById('prayer-list');
  container.innerHTML = '';

  let currentPassed = true;
  for (const name of PRAYER_NAMES) {
    const time = times[name];
    if (!time) {continue;}
    const isPassed = time <= now;
    let isCurrent = false;
    if (isPassed) {
      currentPassed = true;
    } else if (currentPassed) {
      isCurrent = true;
      currentPassed = false;
    }

    const row = document.createElement('div');
    row.className = 'prayer-row' + (isCurrent ? ' current' : '') + (isPassed ? ' passed' : '');
    row.setAttribute('role', 'listitem');

    const timeStr = formatTime(time, settings.timeFormat);

    row.innerHTML = `
      <div class="prayer-info">
        <div class="prayer-icon">${name[0]}</div>
        <div class="prayer-names">
          <span class="prayer-name-en">${t(name)}</span>
          <span class="prayer-name-ar">${getArabicName(name)}</span>
        </div>
      </div>
      <div class="prayer-time">${timeStr}</div>
    `;
    container.appendChild(row);
  }
}

function renderStatus(source) {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  dot.className = 'status-dot';

  if (source === DATA_SOURCE.LIVE) {
    dot.classList.add('live');
    text.textContent = t('Live');
  } else if (source === DATA_SOURCE.CACHED) {
    dot.classList.add('cached');
    text.textContent = t('Cached');
  } else {
    dot.classList.add('calculated');
    text.textContent = t('Calculated');
  }
}

function getArabicName(name) {
  const map = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
  return map[name] || name;
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('beforeunload', () => {
  if (clockInterval) {clearInterval(clockInterval);}
  if (countdownInterval) {clearInterval(countdownInterval);}
});
