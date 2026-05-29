import { AladhanProvider } from '../../src/shared/api/AladhanProvider.js';

describe('AladhanProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new AladhanProvider();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isAvailable', () => {
    test('returns true when API responds OK', async () => {
      global.fetch.mockResolvedValue({ ok: true });
      const result = await provider.isAvailable();
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/status'),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    test('returns false when API is down', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      const result = await provider.isAvailable();
      expect(result).toBe(false);
    });

    test('returns false on HTTP error', async () => {
      global.fetch.mockResolvedValue({ ok: false });
      const result = await provider.isAvailable();
      expect(result).toBe(false);
    });
  });

  describe('fetchMonthly', () => {
    test('returns normalized days for valid response', async () => {
      const mockResponse = {
        code: 200,
        status: 'OK',
        data: [
          {
            timings: {
              Fajr: '04:23 (EEST)',
              Sunrise: '05:58 (EEST)',
              Dhuhr: '12:30 (EEST)',
              Asr: '16:05 (EEST)',
              Maghrib: '19:02 (EEST)',
              Isha: '20:27 (EEST)'
            },
            date: {
              readable: '27 May 2026',
              gregorian: { date: '27-05-2026' },
              hijri: { day: '11', month: { en: 'Dhu al-Hijjah', ar: 'ذو الحجة' }, year: '1447' }
            },
            meta: { method: { id: 5 } }
          }
        ]
      };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await provider.fetchMonthly('Cairo', 'Egypt', 5, { school: 0 });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0].times.Fajr).toBe('04:23');
      expect(result[0].times.Isha).toBe('20:27');
      expect(result[0].hijri.year).toBe('1447');
    });

    test('throws on invalid response structure', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ code: 200, data: 'not-an-array' })
      });
      await expect(provider.fetchMonthly('Cairo', 'Egypt', 5))
        .rejects.toThrow('Invalid monthly response');
    });

    test('throws on HTTP error', async () => {
      global.fetch.mockResolvedValue({ ok: false, status: 500 });
      await expect(provider.fetchMonthly('Cairo', 'Egypt', 5))
        .rejects.toThrow('HTTP 500');
    });

    test('throws on API error code', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ code: 400, status: 'BAD_REQUEST' })
      });
      await expect(provider.fetchMonthly('Cairo', 'Egypt', 5))
        .rejects.toThrow('API error: BAD_REQUEST');
    });
  });

  describe('fetchDaily', () => {
    test('returns normalized day for valid response', async () => {
      const mockResponse = {
        code: 200,
        status: 'OK',
        data: {
          timings: {
            Fajr: '04:23 (EEST)',
            Sunrise: '05:58 (EEST)',
            Dhuhr: '12:30 (EEST)',
            Asr: '16:05 (EEST)',
            Maghrib: '19:02 (EEST)',
            Isha: '20:27 (EEST)'
          },
          date: {
            readable: '27 May 2026',
            gregorian: { date: '27-05-2026' },
            hijri: { day: '11', month: { en: 'Dhu al-Hijjah' }, year: '1447' }
          },
          meta: {}
        }
      };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await provider.fetchDaily('Cairo', 'Egypt', 5);
      expect(result.times.Fajr).toBe('04:23');
      expect(result.hijri.day).toBe('11');
    });

    test('throws on invalid response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ code: 200, data: null })
      });
      await expect(provider.fetchDaily('Cairo', 'Egypt', 5))
        .rejects.toThrow('Invalid daily response');
    });
  });

  describe('_normalizeDay', () => {
    test('extracts timings, hijri, and gregorian date', () => {
      const day = {
        timings: { Fajr: '04:23 (EEST)', Isha: '20:27 (EEST)' },
        date: {
          readable: '27 May 2026',
          gregorian: { date: '27-05-2026' },
          hijri: { day: '11', month: { en: 'Dhu al-Hijjah' }, year: '1447' }
        },
        meta: { timezone: 'Africa/Cairo' }
      };
      const result = provider._normalizeDay(day);
      expect(result.times.Fajr).toBe('04:23');
      expect(result.times.Isha).toBe('20:27');
      expect(result.date).toBe('27-05-2026');
      expect(result.hijri.year).toBe('1447');
      expect(result.meta.timezone).toBe('Africa/Cairo');
    });
  });

  describe('_parseTime', () => {
    test('strips timezone suffix', () => {
      expect(provider._parseTime('04:23 (EEST)')).toBe('04:23');
      expect(provider._parseTime('20:27 (+03)')).toBe('20:27');
    });

    test('returns plain HH:MM as-is', () => {
      expect(provider._parseTime('12:30')).toBe('12:30');
    });

    test('returns null for empty string', () => {
      expect(provider._parseTime('')).toBeNull();
      expect(provider._parseTime(null)).toBeNull();
    });
  });
});
