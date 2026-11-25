import type { DayName } from './types';

export const HOUR_MS = 3600 * 1000;
export const DAY_MS = 24 * HOUR_MS;

// Tanggal "hari ini" mengikuti data demo pada desain asli.
export const TODAY_DATE = 19;
export const TODAY_ISO_DATE = '2026-11-19';
export const TODAY_DAY_NAME: DayName = 'Kamis';
export const TODAY_LABEL = 'Kamis, 19 November 2026';
export const TODAY_SHORT = '19 Nov 2026';

export const DAYS: DayName[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const SEMESTERS = ['Ganjil 2026/2027', 'Genap 2026/2027'] as const;
export const CALENDAR_DAY_HEADERS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
export const NEW_CARD_ICONS = ['book-open', 'sparkles', 'compass', 'brain', 'pencil-ruler', 'lightbulb'];
