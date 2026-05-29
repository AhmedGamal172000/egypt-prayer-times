import { PrayerEngine } from '../../src/shared/prayerEngine.js';
import { DATA_SOURCE, DEFAULT_SETTINGS } from '../../src/shared/config.js';
import { store } from '../../src/shared/store.js';

describe('PrayerEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new PrayerEngine();
    // Reset storage
    store.setMany({});
  });

  // Build mock monthly data using today's actual date so _pickToday finds it
  const pad = (n) => String(n).padStart(2, '0');
  const today = new Date();
  const todayFormatted = `${pad(today.getDate())}-${pad(today.getMonth() + 1)}-${today.getFullYear()}`;
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = `${pad(tomorrow.getDate())}-${pad(tomorrow.getMonth() + 1)}-${tomorrow.getFullYear()}`;

  const mockMonthlyData = [
    {
      date: todayFormatted,
      hijri: { day: '11', month: { en: 'Dhu al-Hijjah', ar: 'ذو الحجة' }, year: '1447' },
      times: { Fajr: '04:23', Sunrise: '05:58', Dhuhr: '12:30', Asr: '16:05', Maghrib: '19:02', Isha: '20:27' }
    },
    {
      date: tomorrowFormatted,
      hijri: { day: '12', month: { en: 'Dhu al-Hijjah', ar: 'ذو الحجة' }, year: '1447' },
      times: { Fajr: '04:22', Sunrise: '05:57', Dhuhr: '12:30', Asr: '16:06', Maghrib: '19:03', Isha: '20:28' }
    }
  ];

  describe('init', () => {
    test('populates data when API succeeds', async () => {
      engine.provider.fetchMonthly = jest.fn().mockResolvedValue(mockMonthlyData);
      await engine.init();
      expect(engine.currentData).not.toBeNull();
      expect(engine.source).toBe(DATA_SOURCE.LIVE);
      expect(engine.currentData.times.Fajr).toBeInstanceOf(Date);
    });

    test('falls back to cache when API fails', async () => {
      engine.provider.fetchMonthly = jest.fn().mockRejectedValue(new Error('Network error'));
      // Pre-populate cache
      await store.set('cachedPrayerData', {
        data: {
          date: '27-05-2026',
          hijri: { day: '11', month: { en: 'Dhu al-Hijjah' }, year: '1447' },
          times: { Fajr: new Date(2026, 4, 27, 4, 23), Sunrise: new Date(2026, 4, 27, 5, 58) },
          timeStrings: { Fajr: '04:23', Sunrise: '05:58' }
        },
        timestamp: Date.now()
      });
      await engine.init();
      expect(engine.source).toBe(DATA_SOURCE.CACHED);
      expect(engine.currentData).not.toBeNull();
    });
  });

  describe('refresh', () => {
    test('stores monthly data for tomorrow lookup', async () => {
      engine.provider.fetchMonthly = jest.fn().mockResolvedValue(mockMonthlyData);
      await engine.refresh();
      expect(engine.monthlyData).toEqual(mockMonthlyData);
      const cachedMonthly = await store.get('cachedMonthlyData');
      expect(cachedMonthly.data).toEqual(mockMonthlyData);
    });

    test('stores timeStrings alongside parsed dates', async () => {
      engine.provider.fetchMonthly = jest.fn().mockResolvedValue(mockMonthlyData);
      await engine.refresh();
      expect(engine.currentData.timeStrings.Fajr).toBe('04:23');
      expect(engine.currentData.timeStrings.Isha).toBe('20:27');
    });
  });

  describe('getToday', () => {
    test('returns safe default when no data exists', async () => {
      engine.provider.fetchMonthly = jest.fn().mockRejectedValue(new Error('Offline'));
      const result = await engine.getToday();
      expect(result.times).toEqual({});
      expect(result.source).toBe(DATA_SOURCE.CACHED);
    });
  });

  describe('getNextPrayer', () => {
    beforeEach(async () => {
      engine.provider.fetchMonthly = jest.fn().mockResolvedValue(mockMonthlyData);
      await engine.refresh();
    });

    test('finds next prayer when some are in the future', async () => {
      // Set Fajr to future, rest to past
      const now = new Date();
      engine.currentData.times = {
        Fajr: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59),
        Sunrise: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59),
        Dhuhr: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59),
        Asr: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59),
        Maghrib: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59),
        Isha: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)
      };
      engine.currentData.timeStrings = {
        Fajr: '23:59', Sunrise: '23:59', Dhuhr: '23:59',
        Asr: '23:59', Maghrib: '23:59', Isha: '23:59'
      };
      const next = await engine.getNextPrayer();
      expect(next).not.toBeNull();
      expect(next.name).toBe('Fajr');
    });

    test('returns tomorrow Fajr when all prayers passed', async () => {
      // Set all prayers to past
      const now = new Date();
      engine.currentData.times = {
        Fajr: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0),
        Sunrise: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1),
        Dhuhr: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 2),
        Asr: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 3),
        Maghrib: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 4),
        Isha: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 5)
      };
      engine.currentData.timeStrings = {
        Fajr: '00:00', Sunrise: '00:01', Dhuhr: '00:02',
        Asr: '00:03', Maghrib: '00:04', Isha: '00:05'
      };
      const next = await engine.getNextPrayer();
      expect(next).not.toBeNull();
      expect(next.name).toBe('Fajr');
      // Should be tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(next.time.getDate()).toBe(tomorrow.getDate());
    });
  });

  describe('_freshTimesFromStrings', () => {
    test('creates dates with today\'s date', () => {
      const strings = { Fajr: '04:23', Dhuhr: '12:30' };
      const result = engine._freshTimesFromStrings(strings);
      const now = new Date();
      expect(result.Fajr.getFullYear()).toBe(now.getFullYear());
      expect(result.Fajr.getMonth()).toBe(now.getMonth());
      expect(result.Fajr.getDate()).toBe(now.getDate());
      expect(result.Fajr.getHours()).toBe(4);
      expect(result.Fajr.getMinutes()).toBe(23);
    });

    test('skips non-string values', () => {
      const strings = { Fajr: '04:23', Isha: null, Sunrise: undefined };
      const result = engine._freshTimesFromStrings(strings);
      expect(result.Fajr).toBeInstanceOf(Date);
      expect(result.Isha).toBeUndefined();
      expect(result.Sunrise).toBeUndefined();
    });

    test('returns empty object for null input', () => {
      expect(engine._freshTimesFromStrings(null)).toEqual({});
    });
  });

  describe('_pickToday', () => {
    test('finds today by gregorian date', () => {
      const data = [
        { date: todayFormatted, times: { Fajr: '04:23' } },
        { date: tomorrowFormatted, times: { Fajr: '04:22' } }
      ];
      const result = engine._pickToday(data);
      expect(result.times.Fajr).toBe('04:23');
    });

    test('falls back to first day if today not found', () => {
      const data = [{ date: '01-01-2020', times: { Fajr: '05:00' } }];
      const result = engine._pickToday(data);
      expect(result.times.Fajr).toBe('05:00');
    });
  });
});
