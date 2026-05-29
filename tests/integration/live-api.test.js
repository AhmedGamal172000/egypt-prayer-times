import { AladhanProvider } from '../../src/shared/api/AladhanProvider.js';
import { EGYPTIAN_CITIES } from '../../src/shared/config.js';

/**
 * LIVE API Integration Tests
 * These make real HTTP calls to Aladhan.com to validate actual prayer data.
 * Focus: prayer time accuracy, hijri dates, DST handling, multi-city coverage.
 */

describe('LIVE API — Aladhan.com Integration', () => {
  const provider = new AladhanProvider();

  // Helper: parse "HH:MM" to minutes from midnight
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Helper: verify prayer order for a single day
  const verifyPrayerOrder = (day) => {
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    for (let i = 0; i < prayers.length - 1; i++) {
      const current = toMinutes(day.times[prayers[i]]);
      const next = toMinutes(day.times[prayers[i + 1]]);
      expect(current).toBeLessThan(next);
    }
  };

  describe('Cairo monthly calendar', () => {
    let monthly;

    beforeAll(async () => {
      monthly = await provider.fetchMonthly('Cairo', 'Egypt', 5, { school: 0 });
    }, 15000);

    test('returns 28-31 days for the month', () => {
      expect(monthly.length).toBeGreaterThanOrEqual(28);
      expect(monthly.length).toBeLessThanOrEqual(31);
    });

    test('every day has all 6 prayers', () => {
      for (const day of monthly) {
        expect(day.times.Fajr).toMatch(/^\d{2}:\d{2}$/);
        expect(day.times.Sunrise).toMatch(/^\d{2}:\d{2}$/);
        expect(day.times.Dhuhr).toMatch(/^\d{2}:\d{2}$/);
        expect(day.times.Asr).toMatch(/^\d{2}:\d{2}$/);
        expect(day.times.Maghrib).toMatch(/^\d{2}:\d{2}$/);
        expect(day.times.Isha).toMatch(/^\d{2}:\d{2}$/);
      }
    });

    test('prayer order is correct on every day', () => {
      for (const day of monthly) {
        verifyPrayerOrder(day);
      }
    });

    test('every day has a valid hijri date', () => {
      for (const day of monthly) {
        expect(day.hijri).toBeDefined();
        expect(day.hijri.day).toBeDefined();
        expect(day.hijri.month).toBeDefined();
        expect(day.hijri.month.en).toBeDefined();
        expect(day.hijri.year).toBeDefined();
      }
    });

    test('every day has a gregorian date', () => {
      for (const day of monthly) {
        expect(day.date).toMatch(/^\d{2}-\d{2}-\d{4}$/);
      }
    });

    test('Dhuhr is around midday (11:30-13:00)', () => {
      for (const day of monthly) {
        const dhuhrMin = toMinutes(day.times.Dhuhr);
        expect(dhuhrMin).toBeGreaterThanOrEqual(11 * 60 + 30);
        expect(dhuhrMin).toBeLessThanOrEqual(13 * 60);
      }
    });

    test('Fajr is before sunrise on every day', () => {
      for (const day of monthly) {
        const fajr = toMinutes(day.times.Fajr);
        const sunrise = toMinutes(day.times.Sunrise);
        expect(fajr).toBeLessThan(sunrise);
        // Fajr typically 60-120 min before sunrise
        expect(sunrise - fajr).toBeGreaterThanOrEqual(45);
        expect(sunrise - fajr).toBeLessThanOrEqual(150);
      }
    });
  });

  describe('Multiple Egyptian cities', () => {
    const cities = ['Alexandria', 'Luxor', 'Aswan', 'Port Said'];

    test.each(cities)('%s returns valid prayer data', async (cityName) => {
      const daily = await provider.fetchDaily(cityName, 'Egypt', 5, { school: 0 });
      expect(daily.times.Fajr).toMatch(/^\d{2}:\d{2}$/);
      expect(daily.times.Isha).toMatch(/^\d{2}:\d{2}$/);
      expect(daily.hijri).toBeDefined();
      verifyPrayerOrder(daily);
    }, 15000);
  });

  describe('Calculation method comparison', () => {
    test('Method 5 (Egyptian) differs from Method 1 (MWL) for Cairo', async () => {
      const egyptian = await provider.fetchDaily('Cairo', 'Egypt', 5, { school: 0 });
      const mwl = await provider.fetchDaily('Cairo', 'Egypt', 1, { school: 0 });
      // Fajr should differ by at least a few minutes
      const diff = Math.abs(toMinutes(egyptian.times.Fajr) - toMinutes(mwl.times.Fajr));
      expect(diff).toBeGreaterThanOrEqual(1);
    }, 15000);
  });

  describe('Hanafi vs Shafi Asr difference', () => {
    test('Hanafi Asr is later than Shafi Asr for Cairo', async () => {
      const shafi = await provider.fetchDaily('Cairo', 'Egypt', 5, { school: 0 });
      const hanafi = await provider.fetchDaily('Cairo', 'Egypt', 5, { school: 1 });
      const shafiAsr = toMinutes(shafi.times.Asr);
      const hanafiAsr = toMinutes(hanafi.times.Asr);
      expect(hanafiAsr).toBeGreaterThan(shafiAsr);
      // Typically 30-60 min difference
      expect(hanafiAsr - shafiAsr).toBeGreaterThanOrEqual(15);
      expect(hanafiAsr - shafiAsr).toBeLessThanOrEqual(90);
    }, 15000);
  });

  describe('All Egyptian cities sanity check', () => {
    test.each(EGYPTIAN_CITIES.map(c => c.name))(
      '%s monthly fetch succeeds',
      async (cityName) => {
        const monthly = await provider.fetchMonthly(cityName, 'Egypt', 5, { school: 0 });
        expect(monthly.length).toBeGreaterThanOrEqual(28);
        verifyPrayerOrder(monthly[0]);
      },
      15000
    );
  });

  describe('Timeout behavior', () => {
    test('slow request returns false (not crash)', async () => {
      const shortProvider = new AladhanProvider();
      shortProvider.timeoutMs = 1;
      const result = await shortProvider.isAvailable();
      expect(result).toBe(false);
    });
  });
});
