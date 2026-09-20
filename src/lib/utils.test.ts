import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  addDaysISO,
  formatLongDate,
  formatShortDate,
  getErrorMessage,
  todayLocalISO,
} from './utils';

// unstubEnvs (vite.config.ts) restores TZ after every test.
function setTimezone(tz: string) {
  vi.stubEnv('TZ', tz);
}

afterEach(() => {
  vi.useRealTimers();
});

describe('todayLocalISO', () => {
  it.each([
    // 9 PM in Toronto: the UTC date is already tomorrow
    ['America/Toronto', '2026-09-21T01:00:00Z', '2026-09-20'],
    ['America/Los_Angeles', '2026-09-21T03:30:00Z', '2026-09-20'],
    // 1:30 AM in Jakarta: the UTC date is still yesterday
    ['Asia/Jakarta', '2026-09-20T18:30:00Z', '2026-09-21'],
    ['UTC', '2026-09-20T12:00:00Z', '2026-09-20'],
  ])('%s at %s -> %s', (tz, now, expected) => {
    setTimezone(tz);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(now));
    expect(todayLocalISO()).toBe(expected);
  });
});

describe('addDaysISO', () => {
  describe.each(['America/Toronto', 'America/Los_Angeles', 'Asia/Jakarta', 'UTC'])(
    'in %s',
    (tz) => {
      it.each([
        ['2026-09-20', 3, '2026-09-23'],
        ['2026-03-06', 3, '2026-03-09'], // US DST starts on Mar 8
        ['2026-03-06', 10, '2026-03-16'],
        ['2026-10-30', 3, '2026-11-02'], // US DST ends on Nov 1
        ['2026-12-30', 3, '2027-01-02'],
        ['2028-02-27', 3, '2028-03-01'], // leap year
      ])('%s + %i days = %s', (start, days, expected) => {
        setTimezone(tz);
        expect(addDaysISO(start, days)).toBe(expected);
      });
    }
  );
});

describe('getErrorMessage', () => {
  it('uses the message of an Error', () => {
    expect(getErrorMessage(new Error('Book already in cart'), 'fallback')).toBe(
      'Book already in cart'
    );
  });

  it('falls back for an empty message or a non-Error value', () => {
    expect(getErrorMessage(new Error(''), 'fallback')).toBe('fallback');
    expect(getErrorMessage('boom', 'fallback')).toBe('fallback');
    expect(getErrorMessage(undefined, 'fallback')).toBe('fallback');
  });
});

describe('date formatters', () => {
  it('format the UTC calendar date, independent of the local timezone', () => {
    setTimezone('America/Los_Angeles');
    expect(formatLongDate('2026-09-23')).toBe('23 September 2026');
    expect(formatShortDate('2026-09-20T23:30:00Z')).toBe('20 Sep 2026');
  });
});
