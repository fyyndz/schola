import { describe, expect, it } from 'vitest';
import {
  durationPartsToHours,
  formatReminderRepeat,
  formatReminderTime,
  formatStudyDuration,
  hoursToDurationParts,
  isReminderOverdue,
} from './utils';

describe('formatReminderTime', () => {
  it('formats a scheduled date and time for display', () => {
    const formatted = formatReminderTime('2026-11-20T07:30:00');

    expect(formatted).toContain('2026');
    expect(formatted).toContain('20');
    expect(formatted).toMatch(/07[:.]30/);
    expect(formatted).toContain(' · ');
  });

  it('preserves legacy display text when the value is not a date', () => {
    expect(formatReminderTime('Besok • 07:00 WIB')).toBe('Besok • 07:00 WIB');
  });
});

describe('reminder recurrence', () => {
  const scheduledAt = '2026-11-20T07:00';
  const afterScheduledTime = new Date('2026-11-20T07:01').getTime();

  it('marks a one-time reminder overdue after its scheduled time', () => {
    expect(
      isReminderOverdue({ scheduledAt, repeat: 'once', repeatDays: [], done: false }, afterScheduledTime),
    ).toBe(true);
    expect(
      isReminderOverdue({ scheduledAt, repeat: 'once', repeatDays: [], done: true }, afterScheduledTime),
    ).toBe(false);
  });

  it('marks recurring reminders overdue only on their selected day', () => {
    expect(
      isReminderOverdue({ scheduledAt, repeat: 'weekdays', repeatDays: [], done: false }, afterScheduledTime),
    ).toBe(true);
    expect(
      isReminderOverdue(
        { scheduledAt, repeat: 'custom', repeatDays: ['Senin'], done: false },
        afterScheduledTime,
      ),
    ).toBe(false);
    expect(
      isReminderOverdue(
        { scheduledAt, repeat: 'custom', repeatDays: ['Jumat'], done: false },
        afterScheduledTime,
      ),
    ).toBe(true);
  });

  it('labels custom recurrence with its selected days', () => {
    expect(formatReminderRepeat('custom', ['Rabu', 'Senin'])).toBe('Kustom: Senin, Rabu');
  });
});

describe('study duration', () => {
  it('converts hours, minutes, and seconds to tracked hours', () => {
    expect(durationPartsToHours({ hours: '1', minutes: '30', seconds: '30' })).toBeCloseTo(1.5083333333333333);
  });

  it('preserves second-level duration when editing an existing study card', () => {
    expect(hoursToDurationParts(1.5083333333333333)).toEqual({
      hours: '1',
      minutes: '30',
      seconds: '30',
    });
  });

  it('formats tracked time using only non-zero units', () => {
    expect(formatStudyDuration(1.5083333333333333)).toBe('1 jam 30 menit 30 detik');
    expect(formatStudyDuration(2)).toBe('2 jam');
  });
});
