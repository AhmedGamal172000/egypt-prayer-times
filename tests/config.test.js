import { DEFAULT_SETTINGS, COUNTRIES, CALCULATION_METHODS } from '../src/shared/config.js';

describe('config', () => {
  test('default city is Cairo', () => {
    expect(DEFAULT_SETTINGS.city).toBe('Cairo');
  });

  test('default country is Egypt', () => {
    expect(DEFAULT_SETTINGS.country).toBe('Egypt');
  });

  test('default method is Egyptian General Authority', () => {
    expect(DEFAULT_SETTINGS.method).toBe(CALCULATION_METHODS.EGYPTIAN_GENERAL_AUTHORITY.id);
  });

  test('countries list is not empty', () => {
    expect(COUNTRIES.length).toBeGreaterThan(0);
  });

  test('each country has cities', () => {
    for (const country of COUNTRIES) {
      expect(country.name).toBeTruthy();
      expect(country.cities.length).toBeGreaterThan(0);
    }
  });
});
