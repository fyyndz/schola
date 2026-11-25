import type { CSSProperties } from 'react';
import { DAY_MS, HOUR_MS } from './constants';
import type { Reminder, ReminderDay, ReminderRepeat, RetentionUnit, Task } from './types';

const REMINDER_DAY_ORDER: ReminderDay[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const JS_DAY_TO_REMINDER_DAY: Record<number, ReminderDay> = {
  0: 'Minggu',
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
};

export function formatHours(hours: number): string {
  return hours.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

export function sortTasksByDeadline(tasks: Task[]): Task[] {
  return [...tasks].sort((left, right) => {
    if (left.completed !== right.completed) return Number(left.completed) - Number(right.completed);
    return left.dueTimestamp - right.dueTimestamp;
  });
}

export interface DurationParts {
  hours: string;
  minutes: string;
  seconds: string;
}

export function durationPartsToHours(parts: DurationParts): number {
  const hours = Number(parts.hours) || 0;
  const minutes = Number(parts.minutes) || 0;
  const seconds = Number(parts.seconds) || 0;
  return (hours * 3600 + minutes * 60 + seconds) / 3600;
}

export function hoursToDurationParts(hours: number): DurationParts {
  const totalSeconds = Math.max(0, Math.round(hours * 3600));
  const wholeHours = Math.floor(totalSeconds / 3600);
  const wholeMinutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: String(wholeHours),
    minutes: String(wholeMinutes),
    seconds: String(seconds),
  };
}

export function formatStudyDuration(hours: number): string {
  const parts = hoursToDurationParts(hours);
  const units = [
    Number(parts.hours) ? `${parts.hours} jam` : '',
    Number(parts.minutes) ? `${parts.minutes} menit` : '',
    Number(parts.seconds) ? `${parts.seconds} detik` : '',
  ].filter(Boolean);

  return units.length ? units.join(' ') : '0 detik';
}

export function formatReminderTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const dateLabel = new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);

  return `${dateLabel} · ${timeLabel}`;
}

export function formatReminderRepeat(repeat: ReminderRepeat, repeatDays: ReminderDay[]): string {
  if (repeat === 'once') return 'Sekali';
  if (repeat === 'daily') return 'Harian';
  if (repeat === 'weekdays') return 'Senin sampai Jumat';

  const selectedDays = REMINDER_DAY_ORDER.filter((day) => repeatDays.includes(day));
  return selectedDays.length ? `Kustom: ${selectedDays.join(', ')}` : 'Kustom';
}

export function isReminderOverdue(
  reminder: Pick<Reminder, 'scheduledAt' | 'repeat' | 'repeatDays' | 'done'>,
  now: number,
): boolean {
  if (reminder.done) return false;

  const scheduledAt = new Date(reminder.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime())) return false;
  if (reminder.repeat === 'once') return scheduledAt.getTime() <= now;

  const currentDate = new Date(now);
  const todayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();
  const scheduledStart = new Date(
    scheduledAt.getFullYear(),
    scheduledAt.getMonth(),
    scheduledAt.getDate(),
  ).getTime();
  if (todayStart < scheduledStart) return false;

  const today = JS_DAY_TO_REMINDER_DAY[currentDate.getDay()];
  const repeatsToday =
    reminder.repeat === 'daily' ||
    (reminder.repeat === 'weekdays' && !['Sabtu', 'Minggu'].includes(today)) ||
    (reminder.repeat === 'custom' && reminder.repeatDays.includes(today));
  if (!repeatsToday) return false;

  const occurrenceToday = new Date(currentDate);
  occurrenceToday.setHours(scheduledAt.getHours(), scheduledAt.getMinutes(), 0, 0);
  return occurrenceToday.getTime() >= scheduledAt.getTime() && occurrenceToday.getTime() <= now;
}

export interface DynamicStyles {
  hex: string;
  cardGradientStyle: CSSProperties;
  badgeStyle: CSSProperties;
  blockStyle: CSSProperties;
  pillStyle: CSSProperties;
  dotStyle: CSSProperties;
}

/** Ubah warna hex bebas menjadi satu set style inline yang serasi. */
export function getDynamicStyles(hex?: string): DynamicStyles {
  let cleanHex = (hex ?? '').trim();
  if (!/^#([0-9A-Fa-f]{6})$/.test(cleanHex)) cleanHex = '#052948';

  const r = parseInt(cleanHex.slice(1, 3), 16);
  const g = parseInt(cleanHex.slice(3, 5), 16);
  const b = parseInt(cleanHex.slice(5, 7), 16);
  const dark = `rgb(${Math.round(r * 0.72)}, ${Math.round(g * 0.72)}, ${Math.round(b * 0.72)})`;

  return {
    hex: cleanHex,
    cardGradientStyle: { background: `linear-gradient(135deg, ${cleanHex} 0%, ${dark} 100%)` },
    badgeStyle: {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.12)`,
      color: cleanHex,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.28)`,
    },
    blockStyle: {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.08)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.30)`,
      color: '#052948',
    },
    pillStyle: { backgroundColor: cleanHex, color: '#ffffff' },
    dotStyle: { backgroundColor: cleanHex },
  };
}

export interface DeadlineStatus {
  isOverdue: boolean;
  isUrgent: boolean;
  text: string;
  badgeClass: string;
}

export function getDeadlineStatus(dueTimestamp: number, isCompleted: boolean, now: number): DeadlineStatus {
  if (isCompleted) {
    return {
      isOverdue: false,
      isUrgent: false,
      text: 'Selesai',
      badgeClass: 'bg-[#4D687D]/15 text-[#052948] border-[#4D687D]/30',
    };
  }

  const diffMs = dueTimestamp - now;
  if (diffMs <= 0) {
    const passedHours = Math.max(1, Math.floor(Math.abs(diffMs) / HOUR_MS));
    return {
      isOverdue: true,
      isUrgent: true,
      text: `Lewat Batas Waktu (${passedHours} jam lalu)`,
      badgeClass: 'bg-red-600 text-white border-red-700 shadow-xs',
    };
  }

  const totalHours = Math.floor(diffMs / HOUR_MS);
  const days = Math.floor(totalHours / 24);
  const remHours = totalHours % 24;

  if (days === 0) {
    return {
      isOverdue: false,
      isUrgent: true,
      text: remHours <= 1 ? 'Tinggal < 1 jam lagi!' : `Tinggal ${remHours} jam lagi`,
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
    };
  }
  if (days === 1) {
    return {
      isOverdue: false,
      isUrgent: true,
      text: `Deadline Besok (${remHours}j lagi)`,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    };
  }
  return {
    isOverdue: false,
    isUrgent: false,
    text: `Tinggal ${days} hari ${remHours} jam`,
    badgeClass: 'bg-[#4D687D]/12 text-[#052948] border-[#4D687D]/25',
  };
}

/** Buang tugas selesai yang sudah melewati masa simpan (atau semuanya jika manual). */
export function pruneTasks(
  tasks: Task[],
  manual: boolean,
  value: number,
  unit: RetentionUnit,
  now: number,
): Task[] {
  const limitMs = unit === 'days' ? value * DAY_MS : value * HOUR_MS;
  return tasks.filter((t) => {
    if (!t.completed) return true;
    if (manual) return false;
    if (!t.completedAt) return true;
    return now - t.completedAt < limitMs;
  });
}
