export type PageKey = 'dashboard' | 'tasks' | 'schedule' | 'calendar' | 'reminders' | 'profile';
export type TaskFilter = 'all' | 'pending' | 'completed';
export type RetentionUnit = 'hours' | 'days';
export type Priority = 'Tinggi' | 'Sedang';
export type DayName = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
export type DeadlinePreset = 'hours_3' | 'tomorrow' | 'days_2' | 'days_4' | 'overdue_test' | 'custom';
export type NotifKey = 'notifDeadline' | 'notifSchedule' | 'notifRoutine';
export type ProfileSwitchKey = NotifKey | 'soundEffectsEnabled';
export type ReminderLeadUnit = 'minutes' | 'hours' | 'days';
export type ReminderRepeat = 'once' | 'daily' | 'weekdays' | 'custom';
export type ReminderDay = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export type ModalId =
  | 'addStudyCardModal'
  | 'addTaskModal'
  | 'addScheduleModal'
  | 'addAgendaModal'
  | 'addReminderModal'
  | 'editProfileModal'
  | 'studyDetailModal'
  | 'logoutModal';

export interface StudyCard {
  id: string;
  title: string;
  subject: string;
  doneHours: number;
  goalHours: number;
  colorHex: string;
  icon: string;
}

export interface Task {
  id: number;
  title: string;
  subject: string;
  colorHex: string;
  customLabel: string;
  priority: Priority;
  completed: boolean;
  completedAt: number | null;
  dueTimestamp: number;
}

export interface NewTaskInput {
  title: string;
  subject: string;
  priority: Priority;
  customLabel: string;
  colorHex: string;
  preset: DeadlinePreset;
  customDatetime: string;
}

export interface ScheduleItem {
  id: string;
  day: DayName;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  colorHex: string;
}

export interface CalendarEvent {
  title: string;
  time: string;
  type: string;
  colorHex: string;
}

export type CalendarEvents = Record<string, CalendarEvent[]>;

export interface Reminder {
  id: number;
  label: string;
  title: string;
  time: string;
  scheduledAt: string;
  leadValue: number;
  leadUnit: ReminderLeadUnit;
  repeat: ReminderRepeat;
  repeatDays: ReminderDay[];
  note: string;
  colorHex: string;
  done: boolean;
}

export type ReminderInput = Omit<Reminder, 'id' | 'done'>;

export interface StudentProfile {
  name: string;
  studentClass: string;
  school: string;
  email: string;
  nis: string;
  avatarDataUrl?: string;
  notifDeadline: boolean;
  notifSchedule: boolean;
  notifRoutine: boolean;
  soundEffectsEnabled: boolean;
}
