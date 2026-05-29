import './options.css';
import { EGYPTIAN_CITIES, DEFAULT_SETTINGS } from '../shared/config.js';
import { translatePage } from '../shared/translations.js';

let currentSettings = { ...DEFAULT_SETTINGS };

async function init() {
  await loadSettings();
  populateCities();
  bindValues();
  setupListeners();
  applyLanguageDirection();
  translatePage(currentSettings.language);
}

async function loadSettings() {
  try {
    const res = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    if (res?.success) {
      currentSettings = { ...DEFAULT_SETTINGS, ...res.data };
    }
  } catch (e) {
    console.error('[Options] loadSettings failed', e);
  }
}

function populateCities() {
  const select = document.getElementById('city');
  select.innerHTML = '';
  for (const city of EGYPTIAN_CITIES) {
    const opt = document.createElement('option');
    opt.value = city.name;
    opt.textContent = currentSettings.language === 'ar' ? city.nameAr : city.name;
    select.appendChild(opt);
  }
}

function bindValues() {
  const s = currentSettings;
  document.getElementById('city').value = s.city?.name || EGYPTIAN_CITIES[0].name;
  document.getElementById('method').value = String(s.method);
  document.getElementById('time-format').value = s.timeFormat;
  document.getElementById('language').value = s.language;
  document.getElementById('provider').value = s.provider;
}

function setupListeners() {
  document.getElementById('btn-save').addEventListener('click', saveSettings);
}

async function saveSettings() {
  const cityName = document.getElementById('city').value;
  const city = EGYPTIAN_CITIES.find(c => c.name === cityName) || EGYPTIAN_CITIES[0];

  const newSettings = {
    city,
    method: parseInt(document.getElementById('method').value, 10),
    timeFormat: document.getElementById('time-format').value,
    language: document.getElementById('language').value,
    provider: document.getElementById('provider').value
  };

  try {
    await chrome.runtime.sendMessage({ type: 'SAVE_SETTINGS', payload: newSettings });
    showToast('Saved');
    // Reload page so new language/theme takes effect immediately
    window.location.reload();
  } catch (e) {
    showToast('Error saving settings');
    console.error(e);
  }
}

function applyLanguageDirection() {
  const html = document.documentElement;
  html.lang = currentSettings.language === 'ar' ? 'ar' : 'en';
  html.dir = currentSettings.language === 'ar' ? 'rtl' : 'ltr';
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

window.addEventListener('DOMContentLoaded', init);
