import { DEFAULT_SETTINGS, EGYPTIAN_CITIES, CALCULATION_METHODS } from '../src/shared/config.js';

describe('config', () => {
  test('default city is Cairo', () => {
    expect(DEFAULT_SETTINGS.city.name).toBe('Cairo');
  });

  test('default method is Egyptian General Authority', () => {
    expect(DEFAULT_SETTINGS.method).toBe(CALCULATION_METHODS.EGYPTIAN_GENERAL_AUTHORITY.id);
  });

  test('Egyptian cities list is not empty', () => {
    expect(EGYPTIAN_CITIES.length).toBeGreaterThan(0);
  });

  test('each city has lat and lng', () => {
    for (const city of EGYPTIAN_CITIES) {
      expect(typeof city.lat).toBe('number');
      expect(typeof city.lng).toBe('number');
    }
  });
});
