import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createInitialTasks,
  initialCalendarEvents,
  initialProfile,
  initialReminders,
  initialSchedule,
  initialStudyCards,
} from './data';
import {
  readPlannerSnapshot,
  removeDemoSeedData,
  writePlannerSnapshot,
  type PlannerSnapshot,
} from './planner-storage';

const storageValues = new Map<string, string>();
const localStorageMock: Storage = {
  get length() {
    return storageValues.size;
  },
  clear: () => storageValues.clear(),
  getItem: (key) => storageValues.get(key) ?? null,
  key: (index) => Array.from(storageValues.keys())[index] ?? null,
  removeItem: (key) => storageValues.delete(key),
  setItem: (key, value) => storageValues.set(key, value),
};

const snapshot: PlannerSnapshot = {
  profile: { ...initialProfile, avatarDataUrl: 'data:image/webp;base64,photo' },
  studyCards: initialStudyCards,
  focusHours: 2.5,
  focusTopicIndex: 1,
  retention: { value: 24, unit: 'hours' },
  tasks: createInitialTasks(new Date('2026-11-26T00:00:00').getTime()),
  schedule: initialSchedule,
  selectedSemester: 'Ganjil 2026/2027',
  calendarEvents: initialCalendarEvents,
  selectedCalDay: '2026-11-26',
  reminders: initialReminders,
};

const originalWindow = globalThis.window;

describe('planner data persistence', () => {
  beforeEach(() => {
    storageValues.clear();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { localStorage: localStorageMock },
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow,
    });
  });

  it('round-trips planner data and the profile photo for the account email', () => {
    writePlannerSnapshot('STUDENT@EXAMPLE.COM', snapshot);

    expect(readPlannerSnapshot('student@example.com')).toEqual(snapshot);
  });

  it('keeps saved planner data isolated by account', () => {
    writePlannerSnapshot('first@example.com', snapshot);

    expect(readPlannerSnapshot('second@example.com')).toBeNull();
  });

  it('rejects malformed saved planner data', () => {
    storageValues.set('schola.planner-data.v1:student%40example.com', '{invalid');

    expect(() => readPlannerSnapshot('student@example.com')).toThrow(
      'Data planner tersimpan rusak dan tidak dapat dibaca.',
    );
  });

  it('removes example content for regular accounts while preserving user-created entries', () => {
    const customCard = {
      id: 'custom-card',
      title: 'Belajar Biologi',
      subject: 'Biologi',
      doneHours: 1.5,
      goalHours: 2,
      colorHex: '#16A34A',
      icon: 'book-open',
    };
    const customTask = {
      id: 99,
      title: 'Tugas Biologi',
      subject: 'Biologi',
      colorHex: '#16A34A',
      customLabel: '',
      priority: 'Sedang' as const,
      completed: false,
      completedAt: null,
      dueTimestamp: 1_800_000_000_000,
    };
    const cleaned = removeDemoSeedData({
      ...snapshot,
      profile: { ...snapshot.profile, avatarDataUrl: undefined },
      studyCards: [...snapshot.studyCards, customCard],
      focusHours: 4.5,
      focusTopicIndex: snapshot.studyCards.length,
      tasks: [...snapshot.tasks, customTask],
      schedule: {
        ...snapshot.schedule,
        Custom: [
          {
            id: 'custom-schedule',
            day: 'Senin',
            startTime: '15:00',
            endTime: '16:00',
            subject: 'Biologi',
            room: 'Rumah',
            colorHex: '#16A34A',
          },
        ],
      },
      calendarEvents: {
        ...snapshot.calendarEvents,
        '2026-12-01': [
          { title: 'Belajar Biologi', time: '15:00', type: 'Belajar', colorHex: '#16A34A' },
        ],
      },
      reminders: [
        ...snapshot.reminders,
        {
          ...snapshot.reminders[0],
          id: 99,
          title: 'Belajar Biologi',
        },
      ],
    });

    expect(cleaned.studyCards).toEqual([{ ...customCard, doneHours: 0 }]);
    expect(cleaned.tasks).toEqual([customTask]);
    expect(cleaned.schedule).toEqual({
      Custom: [
        {
          id: 'custom-schedule',
          day: 'Senin',
          startTime: '15:00',
          endTime: '16:00',
          subject: 'Biologi',
          room: 'Rumah',
          colorHex: '#16A34A',
        },
      ],
    });
    expect(cleaned.calendarEvents).toEqual({
      '2026-12-01': [{ title: 'Belajar Biologi', time: '15:00', type: 'Belajar', colorHex: '#16A34A' }],
    });
    expect(cleaned.reminders).toHaveLength(1);
    expect(cleaned.focusHours).toBe(0);
    expect(cleaned.focusTopicIndex).toBe(0);
    expect(cleaned.profile.nis).toBe('');
  });
});
