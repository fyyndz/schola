import type {
  CalendarEvent,
  CalendarEvents,
  DayName,
  Reminder,
  ReminderDay,
  ReminderLeadUnit,
  ReminderRepeat,
  RetentionUnit,
  ScheduleItem,
  StudentProfile,
  StudyCard,
  Task,
} from './types';
import {
  createInitialTasks,
  initialCalendarEvents,
  initialProfile,
  initialReminders,
  initialSchedule,
  initialStudyCards,
} from './data';

export interface PlannerSnapshot {
  profile: StudentProfile;
  studyCards: StudyCard[];
  focusHours: number;
  focusTopicIndex: number;
  retention: { value: number; unit: RetentionUnit };
  tasks: Task[];
  schedule: Record<string, ScheduleItem[]>;
  selectedSemester: string;
  calendarEvents: CalendarEvents;
  selectedCalDay: string;
  reminders: Reminder[];
}

export function removeDemoSeedData(snapshot: PlannerSnapshot): PlannerSnapshot {
  const demoStudyCardIds = new Set(initialStudyCards.map((card) => card.id));
  const demoTaskIds = new Set(createInitialTasks(0).map((task) => task.id));
  const demoScheduleIds = new Set(
    Object.values(initialSchedule).flat().map((item) => item.id),
  );
  const demoReminderIds = new Set(initialReminders.map((reminder) => reminder.id));
  const demoCalendarEvents = new Set(
    Object.entries(initialCalendarEvents).flatMap(([day, events]) =>
      events.map((event) => `${day}:${event.title}`),
    ),
  );

  const studyCards = snapshot.studyCards
    .filter((card) => !demoStudyCardIds.has(card.id))
    .map((card) => ({ ...card, doneHours: 0 }));
  const tasks = snapshot.tasks.filter((task) => !demoTaskIds.has(task.id));
  const schedule = Object.fromEntries(
    Object.entries(snapshot.schedule)
      .map(([semester, items]) => [semester, items.filter((item) => !demoScheduleIds.has(item.id))])
      .filter(([, items]) => items.length > 0),
  );
  const calendarEvents = Object.fromEntries(
    Object.entries(snapshot.calendarEvents)
      .map(([day, events]) => [
        day,
        events.filter((event) => !demoCalendarEvents.has(`${day}:${event.title}`)),
      ])
      .filter(([, events]) => events.length > 0),
  );
  const reminders = snapshot.reminders.filter((reminder) => !demoReminderIds.has(reminder.id));
  const selectedCard = snapshot.studyCards[snapshot.focusTopicIndex];
  const preservedFocusTopicIndex = selectedCard
    ? studyCards.findIndex((card) => card.id === selectedCard.id)
    : -1;

  return {
    ...snapshot,
    profile: {
      ...snapshot.profile,
      nis: snapshot.profile.nis === initialProfile.nis ? '' : snapshot.profile.nis,
    },
    studyCards,
    focusHours: 0,
    focusTopicIndex: preservedFocusTopicIndex >= 0 ? preservedFocusTopicIndex : 0,
    tasks,
    schedule,
    calendarEvents,
    reminders,
  };
}

interface StoredPlannerSnapshot extends PlannerSnapshot {
  version: 1;
}

const STORAGE_PREFIX = 'schola.planner-data.v1:';
const DAY_NAMES: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const REMINDER_DAYS: ReminderDay[] = [...DAY_NAMES, 'Minggu'];
const REMINDER_LEAD_UNITS: ReminderLeadUnit[] = ['minutes', 'hours', 'days'];
const REMINDER_REPEATS: ReminderRepeat[] = ['once', 'daily', 'weekdays', 'custom'];
const RETENTION_UNITS: RetentionUnit[] = ['hours', 'days'];
const PRIORITIES: Task['priority'][] = ['Tinggi', 'Sedang'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isRecordOfArrays<T>(
  value: unknown,
  isItem: (item: unknown) => item is T,
): value is Record<string, T[]> {
  return isRecord(value) && Object.values(value).every(
    (items) => Array.isArray(items) && items.every(isItem),
  );
}

function isStudentProfile(value: unknown): value is StudentProfile {
  if (!isRecord(value)) return false;
  return (
    isString(value.name) &&
    isString(value.studentClass) &&
    isString(value.school) &&
    isString(value.email) &&
    isString(value.nis) &&
    (value.avatarDataUrl === undefined || isString(value.avatarDataUrl)) &&
    typeof value.notifDeadline === 'boolean' &&
    typeof value.notifSchedule === 'boolean' &&
    typeof value.notifRoutine === 'boolean' &&
    (value.soundEffectsEnabled === undefined || typeof value.soundEffectsEnabled === 'boolean')
  );
}

function isStudyCard(value: unknown): value is StudyCard {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    isString(value.title) &&
    isString(value.subject) &&
    isNumber(value.doneHours) &&
    isNumber(value.goalHours) &&
    isString(value.colorHex) &&
    isString(value.icon)
  );
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false;
  return (
    isNumber(value.id) &&
    isString(value.title) &&
    isString(value.subject) &&
    isString(value.colorHex) &&
    isString(value.customLabel) &&
    PRIORITIES.includes(value.priority as Task['priority']) &&
    typeof value.completed === 'boolean' &&
    (value.completedAt === null || isNumber(value.completedAt)) &&
    isNumber(value.dueTimestamp)
  );
}

function isScheduleItem(value: unknown): value is ScheduleItem {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    DAY_NAMES.includes(value.day as DayName) &&
    isString(value.startTime) &&
    isString(value.endTime) &&
    isString(value.subject) &&
    isString(value.room) &&
    isString(value.colorHex)
  );
}

function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!isRecord(value)) return false;
  return (
    isString(value.title) &&
    isString(value.time) &&
    isString(value.type) &&
    isString(value.colorHex)
  );
}

function isReminder(value: unknown): value is Reminder {
  if (!isRecord(value)) return false;
  return (
    isNumber(value.id) &&
    isString(value.label) &&
    isString(value.title) &&
    isString(value.time) &&
    isString(value.scheduledAt) &&
    isNumber(value.leadValue) &&
    REMINDER_LEAD_UNITS.includes(value.leadUnit as ReminderLeadUnit) &&
    REMINDER_REPEATS.includes(value.repeat as ReminderRepeat) &&
    Array.isArray(value.repeatDays) &&
    value.repeatDays.every((day) => REMINDER_DAYS.includes(day as ReminderDay)) &&
    isString(value.note) &&
    isString(value.colorHex) &&
    typeof value.done === 'boolean'
  );
}

function isStoredPlannerSnapshot(value: unknown): value is StoredPlannerSnapshot {
  if (!isRecord(value)) return false;
  return (
    value.version === 1 &&
    isStudentProfile(value.profile) &&
    Array.isArray(value.studyCards) &&
    value.studyCards.every(isStudyCard) &&
    isNumber(value.focusHours) &&
    isNumber(value.focusTopicIndex) &&
    Number.isInteger(value.focusTopicIndex) &&
    value.focusTopicIndex >= 0 &&
    isRecord(value.retention) &&
    isNumber(value.retention.value) &&
    RETENTION_UNITS.includes(value.retention.unit as RetentionUnit) &&
    Array.isArray(value.tasks) &&
    value.tasks.every(isTask) &&
    isRecordOfArrays(value.schedule, isScheduleItem) &&
    isString(value.selectedSemester) &&
    isRecordOfArrays(value.calendarEvents, isCalendarEvent) &&
    isString(value.selectedCalDay) &&
    Array.isArray(value.reminders) &&
    value.reminders.every(isReminder)
  );
}

function storageKey(email: string): string {
  return `${STORAGE_PREFIX}${encodeURIComponent(email.trim().toLowerCase())}`;
}

export function readPlannerSnapshot(email: string): PlannerSnapshot | null {
  const serialized = window.localStorage.getItem(storageKey(email));
  if (!serialized) return null;

  let value: unknown;
  try {
    value = JSON.parse(serialized);
  } catch {
    throw new Error('Data planner tersimpan rusak dan tidak dapat dibaca.');
  }

  if (!isStoredPlannerSnapshot(value)) {
    throw new Error('Format data planner tersimpan tidak valid.');
  }

  return {
    profile: { ...value.profile, soundEffectsEnabled: value.profile.soundEffectsEnabled ?? true },
    studyCards: value.studyCards,
    focusHours: value.focusHours,
    focusTopicIndex: value.focusTopicIndex,
    retention: value.retention,
    tasks: value.tasks,
    schedule: value.schedule,
    selectedSemester: value.selectedSemester,
    calendarEvents: value.calendarEvents,
    selectedCalDay: value.selectedCalDay,
    reminders: value.reminders,
  };
}

export function writePlannerSnapshot(email: string, snapshot: PlannerSnapshot): void {
  try {
    const stored: StoredPlannerSnapshot = { version: 1, ...snapshot };
    window.localStorage.setItem(storageKey(email), JSON.stringify(stored));
  } catch {
    throw new Error('Data belum tersimpan. Penyimpanan browser penuh atau tidak tersedia.');
  }
}

export function movePlannerSnapshot(fromEmail: string, toEmail: string): void {
  const snapshot = readPlannerSnapshot(fromEmail);
  if (snapshot) writePlannerSnapshot(toEmail, snapshot);

  try {
    window.localStorage.removeItem(storageKey(fromEmail));
  } catch {
    throw new Error('Data planner sudah dipindahkan, tetapi salinan lama tidak dapat dihapus.');
  }
}
