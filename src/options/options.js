import './options.css';
import { COUNTRIES, DEFAULT_SETTINGS } from '../shared/config.js';
import { translatePage } from '../shared/translations.js';

let currentSettings = { ...DEFAULT_SETTINGS };

async function init() {
  await loadSettings();
  populateCountries();
  populateCities(currentSettings.country);
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
      // Migration: old format stored city as object {name, nameAr, lat, lng}
      if (currentSettings.city && typeof currentSettings.city === 'object') {
        currentSettings.city = currentSettings.city.name || DEFAULT_SETTINGS.city;
      }
      if (!currentSettings.country) {
        currentSettings.country = DEFAULT_SETTINGS.country;
      }
    }
  } catch (e) {
    console.error('[Options] loadSettings failed', e);
  }
}

function populateCountries() {
  const select = document.getElementById('country');
  select.innerHTML = '';
  for (const country of COUNTRIES) {
    const opt = document.createElement('option');
    opt.value = country.name;
    opt.textContent = currentSettings.language === 'ar' ? country.nameAr : country.name;
    select.appendChild(opt);
  }
}

function populateCities(countryName) {
  const select = document.getElementById('city');
  select.innerHTML = '';
  const country = COUNTRIES.find(c => c.name === countryName);
  if (!country) { return; }
  for (const city of country.cities) {
    const opt = document.createElement('option');
    opt.value = city.name;
    opt.textContent = currentSettings.language === 'ar' ? city.nameAr : city.name;
    select.appendChild(opt);
  }
}

function bindValues() {
  const s = currentSettings;
  document.getElementById('country').value = s.country || COUNTRIES[0].name;
  populateCities(s.country || COUNTRIES[0].name);
  document.getElementById('city').value = s.city || COUNTRIES[0].cities[0].name;
  document.getElementById('method').value = String(s.method);
  document.getElementById('time-format').value = s.timeFormat;
  document.getElementById('language').value = s.language;
  document.getElementById('provider').value = s.provider;
}

function setupListeners() {
  document.getElementById('country').addEventListener('change', onCountryChange);
  document.getElementById('btn-save').addEventListener('click', saveSettings);
}

function onCountryChange() {
  const countryName = document.getElementById('country').value;
  populateCities(countryName);
  // Select first city of new country
  const country = COUNTRIES.find(c => c.name === countryName);
  if (country && country.cities.length > 0) {
    document.getElementById('city').value = country.cities[0].name;
  }
}

async function saveSettings() {
  const newSettings = {
    country: document.getElementById('country').value,
    city: document.getElementById('city').value,
    method: parseInt(document.getElementById('method').value, 10),
    timeFormat: document.getElementById('time-format').value,
    language: document.getElementById('language').value,
    provider: document.getElementById('provider').value
  };

  try {
    await chrome.runtime.sendMessage({ type: 'SAVE_SETTINGS', payload: newSettings });
    showToast('Saved');
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
