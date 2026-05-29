/**
 * Central configuration for the Egypt Prayer Times extension.
 * All configurable values live here — never hardcoded elsewhere.
 */

/** @type {string} */
export const EXTENSION_VERSION = '1.0.0';

/** API Configuration */
export const API_CONFIG = {
  ALADHAN_BASE_URL: 'https://api.aladhan.com/v1',
  DEFAULT_TIMEOUT_MS: 10000,
  CACHE_TTL_HOURS: 24
};

/** Calculation methods mapping for Aladhan API */
export const CALCULATION_METHODS = {
  EGYPTIAN_GENERAL_AUTHORITY: { id: 5, name: 'Egyptian General Authority of Survey' },
  MUSLIM_WORLD_LEAGUE: { id: 1, name: 'Muslim World League' },
  ISNA: { id: 2, name: 'Islamic Society of North America' },
  MAKKAH: { id: 4, name: 'Umm Al-Qura University, Makkah' },
  KARACHI: { id: 1, name: 'University of Islamic Sciences, Karachi' } // fallback
};

/** Default calculation method */
export const DEFAULT_METHOD = CALCULATION_METHODS.EGYPTIAN_GENERAL_AUTHORITY.id;

/** Time format preferences */
export const TIME_FORMAT = {
  H12: '12h',
  H24: '24h'
};

/** UI Themes */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

/** Supported languages */
export const LANGUAGE = {
  EN: 'en',
  AR: 'ar'
};

/** Data source status indicators */
export const DATA_SOURCE = {
  LIVE: 'live',
  CACHED: 'cached',
  CALCULATED: 'calculated'
};

/** Egyptian cities with coordinates */
export const EGYPTIAN_CITIES = [
  { name: 'Cairo', nameAr: 'القاهرة', lat: 30.0444, lng: 31.2357 },
  { name: 'Alexandria', nameAr: 'الإسكندرية', lat: 31.2001, lng: 29.9187 },
  { name: 'Giza', nameAr: 'الجيزة', lat: 30.0131, lng: 31.2089 },
  { name: 'Shubra El-Kheima', nameAr: 'شبرا الخيمة', lat: 30.1286, lng: 31.2422 },
  { name: 'Port Said', nameAr: 'بورسعيد', lat: 31.2653, lng: 32.3019 },
  { name: 'Suez', nameAr: 'السويس', lat: 29.9668, lng: 32.5498 },
  { name: 'Luxor', nameAr: 'الأقصر', lat: 25.6872, lng: 32.6396 },
  { name: 'Al-Mansura', nameAr: 'المنصورة', lat: 31.0409, lng: 31.3785 },
  { name: 'El-Mahalla El-Kubra', nameAr: 'المحلة الكبرى', lat: 30.9706, lng: 31.1668 },
  { name: 'Tanta', nameAr: 'طنطا', lat: 30.7865, lng: 31.0004 },
  { name: 'Asyut', nameAr: 'أسيوط', lat: 27.1783, lng: 31.1859 },
  { name: 'Ismailia', nameAr: 'الإسماعيلية', lat: 30.5965, lng: 32.2715 },
  { name: 'Fayyum', nameAr: 'الفيوم', lat: 29.3084, lng: 30.8428 },
  { name: 'Zagazig', nameAr: 'الزقازيق', lat: 30.5765, lng: 31.5041 },
  { name: 'Aswan', nameAr: 'أسوان', lat: 24.0889, lng: 32.8998 },
  { name: 'Damietta', nameAr: 'دمياط', lat: 31.4175, lng: 31.8144 },
  { name: 'Damanhur', nameAr: 'دمنهور', lat: 31.0341, lng: 30.4682 },
  { name: 'Minya', nameAr: 'المنيا', lat: 28.1099, lng: 30.7503 },
  { name: 'Beni Suef', nameAr: 'بني سويف', lat: 29.0661, lng: 31.0994 },
  { name: 'Qena', nameAr: 'قنا', lat: 26.1642, lng: 32.7267 },
  { name: 'Sohag', nameAr: 'سوهاج', lat: 26.5569, lng: 31.6948 },
  { name: 'Hurghada', nameAr: 'الغردقة', lat: 27.2579, lng: 33.8116 },
  { name: '6th of October', nameAr: 'السادس من أكتوبر', lat: 29.9285, lng: 30.9263 },
  { name: 'Sharm El-Sheikh', nameAr: 'شرم الشيخ', lat: 27.9158, lng: 34.3300 },
  { name: 'Banha', nameAr: 'بنها', lat: 30.4659, lng: 31.1848 },
  { name: 'Kafr el-Sheikh', nameAr: 'كفر الشيخ', lat: 31.1113, lng: 30.9408 },
  { name: 'Marsa Matruh', nameAr: 'مرسى مطروح', lat: 31.3543, lng: 27.2373 },
  { name: 'Arish', nameAr: 'العريش', lat: 31.1321, lng: 33.8034 }
];

/** Default user settings */
export const DEFAULT_SETTINGS = {
  city: EGYPTIAN_CITIES[0], // Cairo
  method: DEFAULT_METHOD,
  timeFormat: TIME_FORMAT.H12,
  language: LANGUAGE.EN,
  theme: THEME.SYSTEM,
  provider: 'aladhan',
  // custom coordinates removed — always use selected city
};

/** Alarm constants */
export const ALARMS = {
  DAILY_SYNC: 'daily-sync',
  MINUTE_TICK: 'minute-tick',
  HOURLY_REFRESH: 'hourly-refresh',
  SYNC_HOUR: 3,
  SYNC_MINUTE: 0
};

/** Prayer names in order */
export const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
