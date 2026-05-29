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
  document.getElementById('use-custom-coords').checked = !!s.useCustomCoords;
  document.getElementById('lat').value = s.customLat ?? '';
  document.getElementById('lng').value = s.customLng ?? '';
  document.getElementById('method').value = String(s.method);
  document.getElementById('time-format').value = s.timeFormat;
  document.getElementById('language').value = s.language;
  document.getElementById('theme').value = s.theme;
  document.getElementById('provider').value = s.provider;

  toggleCustomCoords();
}

function setupListeners() {
  document.getElementById('use-custom-coords').addEventListener('change', toggleCustomCoords);
  document.getElementById('btn-save').addEventListener('click', saveSettings);
}

function toggleCustomCoords() {
  const checked = document.getElementById('use-custom-coords').checked;
  document.getElementById('custom-coords-group').classList.toggle('hidden', !checked);
}

async function saveSettings() {
  const cityName = document.getElementById('city').value;
  const city = EGYPTIAN_CITIES.find(c => c.name === cityName) || EGYPTIAN_CITIES[0];

  const newSettings = {
    city,
    useCustomCoords: document.getElementById('use-custom-coords').checked,
    customLat: parseFloat(document.getElementById('lat').value) || null,
    customLng: parseFloat(document.getElementById('lng').value) || null,
    method: parseInt(document.getElementById('method').value, 10),
    timeFormat: document.getElementById('time-format').value,
    language: document.getElementById('language').value,
    theme: document.getElementById('theme').value,
    provider: document.getElementById('provider').value
  };

  try {
    await chrome.runtime.sendMessage({ type: 'SAVE_SETTINGS', payload: newSettings });
    showToast('Saved');
    // Re-apply direction in case language changed
    currentSettings = newSettings;
    applyLanguageDirection();
    populateCities();
    bindValues();
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
