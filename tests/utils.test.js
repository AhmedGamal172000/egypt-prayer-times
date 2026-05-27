import { formatTime, getTimeRemaining, formatCountdown } from '../src/shared/utils.js';

describe('utils', () => {
  test('formatTime 24h', () => {
    const d = new Date(2026, 0, 1, 14, 5, 0);
    expect(formatTime(d, '24h')).toBe('14:05');
  });

  test('formatTime 12h PM', () => {
    const d = new Date(2026, 0, 1, 14, 5, 0);
    expect(formatTime(d, '12h')).toBe('02:05 PM');
  });

  test('formatTime 12h AM', () => {
    const d = new Date(2026, 0, 1, 4, 5, 0);
    expect(formatTime(d, '12h')).toBe('04:05 AM');
  });

  test('getTimeRemaining returns null for past date', () => {
    const past = new Date(Date.now() - 1000);
    expect(getTimeRemaining(past)).toBeNull();
  });

  test('getTimeRemaining calculates correctly', () => {
    const future = new Date(Date.now() + 3661000); // 1h 1m 1s
    const rem = getTimeRemaining(future);
    expect(rem.hours).toBe(1);
    expect(rem.minutes).toBe(1);
    expect(rem.seconds).toBe(1);
  });

  test('formatCountdown formats correctly', () => {
    expect(formatCountdown({ hours: 1, minutes: 2, seconds: 3 })).toBe('01:02:03');
    expect(formatCountdown(null)).toBe('00:00:00');
  });
});
