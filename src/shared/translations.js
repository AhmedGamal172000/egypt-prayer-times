/**
 * Runtime translations for the extension.
 * Unlike chrome.i18n.getMessage(), this respects the extension's language setting.
 */

const TRANSLATIONS = {
  en: {
    extName: 'Egypt Prayer Times',
    extDescription: 'Accurate Muslim prayer times for Egypt with live API and offline fallback.',
    Fajr: 'Fajr',
    Sunrise: 'Sunrise',
    Dhuhr: 'Dhuhr',
    Asr: 'Asr',
    Maghrib: 'Maghrib',
    Isha: 'Isha',
    NextPrayer: 'Next Prayer',
    TimeRemaining: 'Time Remaining',
    Settings: 'Settings',
    City: 'City',
    CalculationMethod: 'Calculation Method',
    Madhab: 'Madhab',
    TimeFormat: 'Time Format',
    Language: 'Language',
    Theme: 'Theme',
    Light: 'Light',
    Dark: 'Dark',
    System: 'System',
    Shafi: 'Shafi',
    Hanafi: 'Hanafi',
    Hour12: '12-hour',
    Hour24: '24-hour',
    English: 'English',
    Arabic: 'Arabic',
    Live: 'Live',
    Cached: 'Cached',
    Calculated: 'Calculated',
    MethodEgyptian: 'Egyptian General Authority of Survey',
    MethodMWL: 'Muslim World League',
    MethodISNA: 'Islamic Society of North America',
    MethodMakkah: 'Umm Al-Qura University, Makkah',
    NotificationMessage: "It's time for $1 prayer",
    Offline: 'Offline',
    Expand: 'Expand',
    Save: 'Save',
    CurrentTime: 'Current Time',

    DataSource: 'Data Source',
    Provider: 'Provider'
  },
  ar: {
    extName: 'مواقيت الصلاة في مصر',
    extDescription: 'مواقيت صلاة دقيقة للمسلمين في مصر مع دعم الاتصال المباشر والعمل بدون إنترنت.',
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
    NextPrayer: 'الصلاة القادمة',
    TimeRemaining: 'الوقت المتبقي',
    Settings: 'الإعدادات',
    City: 'المدينة',
    CalculationMethod: 'طريقة الحساب',
    Madhab: 'المذهب',
    TimeFormat: 'تنسيق الوقت',
    Language: 'اللغة',
    Theme: 'المظهر',
    Light: 'فاتح',
    Dark: 'داكن',
    System: 'النظام',
    Shafi: 'شافعي',
    Hanafi: 'حنفي',
    Hour12: '١٢ ساعة',
    Hour24: '٢٤ ساعة',
    English: 'الإنجليزية',
    Arabic: 'العربية',
    Live: 'مباشر',
    Cached: 'مخزن',
    Calculated: 'محسوب',
    MethodEgyptian: 'الهيئة المصرية العامة للمساحة',
    MethodMWL: 'رابطة العالم الإسلامي',
    MethodISNA: 'الجمعية الإسلامية لأمريكا الشمالية',
    MethodMakkah: 'جامعة أم القرى، مكة',
    NotificationMessage: 'حان وقت صلاة $1',
    Offline: 'بدون إنترنت',
    Expand: 'توسيع',
    Save: 'حفظ',
    CurrentTime: 'الوقت الحالي',

    DataSource: 'مصدر البيانات',
    Provider: 'المزود'
  }
};

/**
 * Get a translated string by key and language.
 * Supports simple positional placeholders: $1, $2, etc.
 * @param {string} key
 * @param {string} lang - 'en' | 'ar'
 * @param {...string} substitutions
 * @returns {string}
 */
export function t(key, lang = 'en', ...substitutions) {
  let text = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en?.[key] ?? key;
  substitutions.forEach((sub, i) => {
    text = text.replace(new RegExp('\\$' + (i + 1), 'g'), sub);
  });
  return text;
}

/**
 * Translate all elements with data-i18n attribute.
 * @param {string} lang - 'en' | 'ar'
 */
export function translatePage(lang = 'en') {
  if (typeof document === 'undefined') { return; }
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) { return; }
    const translated = t(key, lang);
    if (translated) {
      el.textContent = translated;
    }
  });
}
