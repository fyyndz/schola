import { HOUR_MS } from './constants';
import type {
  CalendarEvents,
  Reminder,
  ScheduleItem,
  StudentProfile,
  StudyCard,
  Task,
} from './types';

export const initialProfile: StudentProfile = {
  name: 'Schola',
  studentClass: 'XI IPA 2',
  school: 'SMA Negeri 1 Harapan Bangsa',
  email: 'schola@gmail.com',
  nis: '202611089',
  notifDeadline: true,
  notifSchedule: true,
  notifRoutine: false,
  soundEffectsEnabled: true,
};

export const initialStudyCards: StudyCard[] = [
  { id: 'sc-1', title: 'Matematika Aljabar', subject: 'Matematika', doneHours: 3.0, goalHours: 4.0, colorHex: '#0D9488', icon: 'calculator' },
  { id: 'sc-2', title: 'Praktikum Kimia', subject: 'Kimia', doneHours: 4.3, goalHours: 5.0, colorHex: '#7C3AED', icon: 'flask-conical' },
  { id: 'sc-3', title: 'Bahasa Inggris', subject: 'Bahasa Inggris', doneHours: 4.7, goalHours: 5.0, colorHex: '#EC4899', icon: 'book-open' },
];

export function createInitialTasks(now: number): Task[] {
  return [
    { id: 1, title: 'Latihan Soal Integral & Matriks', subject: 'Matematika', colorHex: '#0D9488', customLabel: 'Deadline Besok', priority: 'Tinggi', completed: false, completedAt: null, dueTimestamp: now + 22 * HOUR_MS },
    { id: 2, title: 'Laporan Praktikum Titrasi Asam Basa', subject: 'Kimia', colorHex: '#7C3AED', customLabel: 'Praktikum Lab', priority: 'Tinggi', completed: false, completedAt: null, dueTimestamp: now + 5 * HOUR_MS },
    { id: 3, title: 'Reading Comprehension & Essay', subject: 'Bahasa Inggris', colorHex: '#EC4899', customLabel: 'Tugas Individu', priority: 'Sedang', completed: false, completedAt: null, dueTimestamp: now + 52 * HOUR_MS },
    { id: 4, title: 'Rangkuman Hukum Newton & Gerak', subject: 'Fisika', colorHex: '#4D687D', customLabel: 'Persiapan Kuis', priority: 'Tinggi', completed: false, completedAt: null, dueTimestamp: now - 3 * HOUR_MS },
    { id: 5, title: 'Proposal Kegiatan Classmeeting OSIS', subject: 'Organisasi OSIS', colorHex: '#052948', customLabel: 'Rapat Sore', priority: 'Sedang', completed: true, completedAt: now - 2 * HOUR_MS, dueTimestamp: now + 20 * HOUR_MS },
  ];
}

export const initialSchedule: Record<string, ScheduleItem[]> = {
  'Ganjil 2026/2027': [
    { id: 'sch-1', day: 'Senin', startTime: '07:15', endTime: '08:45', subject: 'Matematika', room: 'R. XI IPA 2', colorHex: '#0D9488' },
    { id: 'sch-2', day: 'Senin', startTime: '09:00', endTime: '10:30', subject: 'Bahasa Inggris', room: 'Lab Bahasa', colorHex: '#EC4899' },
    { id: 'sch-3', day: 'Selasa', startTime: '07:30', endTime: '09:30', subject: 'Kimia', room: 'Lab Kimia', colorHex: '#7C3AED' },
    { id: 'sch-4', day: 'Selasa', startTime: '10:00', endTime: '11:30', subject: 'Sejarah', room: 'R. XI IPA 2', colorHex: '#D97706' },
    { id: 'sch-5', day: 'Rabu', startTime: '08:00', endTime: '09:45', subject: 'Fisika', room: 'Lab Fisika', colorHex: '#4D687D' },
    { id: 'sch-6', day: 'Rabu', startTime: '13:00', endTime: '14:30', subject: 'Informatika', room: 'Lab Komputer', colorHex: '#0284C7' },
    { id: 'sch-7', day: 'Kamis', startTime: '07:30', endTime: '09:00', subject: 'Matematika', room: 'R. XI IPA 2', colorHex: '#0D9488' },
    { id: 'sch-8', day: 'Kamis', startTime: '09:30', endTime: '11:15', subject: 'Kimia', room: 'Lab Kimia', colorHex: '#7C3AED' },
    { id: 'sch-9', day: 'Kamis', startTime: '13:15', endTime: '14:45', subject: 'Bahasa Inggris', room: 'R. XI IPA 2', colorHex: '#EC4899' },
    { id: 'sch-10', day: 'Jumat', startTime: '07:30', endTime: '09:00', subject: 'Biologi', room: 'Lab Biologi', colorHex: '#16A34A' },
    { id: 'sch-11', day: 'Sabtu', startTime: '08:30', endTime: '10:30', subject: 'Rapat OSIS & Ekskul', room: 'Aula Sekolah', colorHex: '#052948' },
  ],
  'Genap 2026/2027': [
    { id: 'sch-g1', day: 'Senin', startTime: '07:15', endTime: '08:45', subject: 'Fisika', room: 'Lab Fisika', colorHex: '#4D687D' },
    { id: 'sch-g2', day: 'Rabu', startTime: '09:00', endTime: '10:30', subject: 'Matematika', room: 'R. XI IPA 2', colorHex: '#0D9488' },
    { id: 'sch-g3', day: 'Kamis', startTime: '08:00', endTime: '09:45', subject: 'Bahasa Inggris', room: 'Lab Bahasa', colorHex: '#EC4899' },
  ],
};

export const initialCalendarEvents: CalendarEvents = {
  '2026-11-05': [{ title: 'Kuis Matematika Aljabar', time: '08:00 - 09:00', type: 'Ulangan', colorHex: '#0D9488' }],
  '2026-11-12': [{ title: 'Praktikum Kimia Larutan', time: '10:00 - 11:30', type: 'Praktikum', colorHex: '#7C3AED' }],
  '2026-11-19': [
    { title: 'Belajar Ulangan Harian Fisika', time: '15:30 - 17:00', type: 'Belajar', colorHex: '#4D687D' },
    { title: 'Rapat OSIS Persiapan Classmeeting', time: '13:30 - 14:45', type: 'OSIS', colorHex: '#052948' },
  ],
  '2026-11-24': [{ title: 'Presentasi Bahasa Inggris', time: '09:30 - 11:00', type: 'Presentasi', colorHex: '#EC4899' }],
  '2026-11-28': [{ title: 'Tryout UTBK Internal', time: '07:30 - 11:00', type: 'Ujian', colorHex: '#791A0A' }],
};

export const initialReminders: Reminder[] = [
  { id: 1, label: 'Deadline Besok!', title: 'Latihan Soal Integral & Matriks', time: 'Besok • 07:00 WIB', scheduledAt: '2026-11-20T07:00', leadValue: 1, leadUnit: 'days', repeat: 'once', repeatDays: [], note: 'Kumpulkan di meja Pak Hendra sebelum jam pertama.', colorHex: '#791A0A', done: false },
  { id: 2, label: 'Jadwal Besok', title: 'Praktikum Kimia & Biologi', time: 'Besok • 07:30 WIB', scheduledAt: '2026-11-20T07:30', leadValue: 30, leadUnit: 'minutes', repeat: 'once', repeatDays: [], note: 'Jangan lupa bawa jas lab dan buku laporan praktikum.', colorHex: '#7C3AED', done: false },
  { id: 3, label: 'Pengingat Rutin', title: 'Review Catatan Belajar Malam', time: 'Setiap Hari • 19:30 WIB', scheduledAt: '2026-11-19T19:30', leadValue: 0, leadUnit: 'minutes', repeat: 'daily', repeatDays: [], note: 'Sesi fokus 45 menit sebelum istirahat malam.', colorHex: '#052948', done: false },
];
