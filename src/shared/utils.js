/**
 * Shared utility functions.
 */

/**
 * Format a Date to time string based on format preference.
 * @param {Date} date
 * @param {string} format - '12h' | '24h'
 * @returns {string}
 */
export function formatTime(date, format = '12h') {
  if (!(date instanceof Date) || isNaN(date)) {return '--:--';}
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const pad = (n) => String(n).padStart(2, '0');

  if (format === '24h') {
    return `${pad(hours)}:${pad(minutes)}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${pad(h12)}:${pad(minutes)} ${period}`;
}

/**
 * Format a Date to Hijri date string (fallback estimation).
 * In production, prefer API-provided Hijri date.
 * @param {Date} date
 * @returns {string}
 */
export function formatHijriDate(date) {
  // Fallback: simple estimation. API should provide accurate Hijri date.
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    return new Intl.DateTimeFormat('en-TN-u-ca-islamic', options).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

/**
 * Format a Date to Gregorian date string.
 * @param {Date} date
 * @param {string} locale
 * @returns {string}
 */
export function formatGregorianDate(date, locale = 'en-US') {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(locale, options);
}

/**
 * Get remaining time between now and target as {hours, minutes, seconds}.
 * @param {Date} target
 * @returns {Object|null}
 */
export function getTimeRemaining(target) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {return null;}

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds, totalSeconds };
}

/**
 * Format remaining time as HH:MM:SS.
 * @param {Object} remaining
 * @returns {string}
 */
export function formatCountdown(remaining) {
  if (!remaining) {return '00:00:00';}
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(remaining.hours)}:${pad(remaining.minutes)}:${pad(remaining.seconds)}`;
}

/**
 * Debounce function calls.
 * @param {Function} fn
 * @param {number} delayMs
 * @returns {Function}
 */
export function debounce(fn, delayMs) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Deep merge two objects.
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
export function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Detect if user is likely online.
 * @returns {boolean}
 */
export function isOnline() {
  return navigator.onLine;
}
