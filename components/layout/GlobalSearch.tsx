'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import type { PageKey } from '@/lib/types';

interface SearchResult {
  key: string;
  title: string;
  detail: string;
  page: PageKey;
  studyCardId?: string;
}

export default function GlobalSearch({ compact = false }: { compact?: boolean }) {
  const {
    search,
    setSearch,
    setPage,
    studyCards,
    tasks,
    schedule,
    calendarEvents,
    reminders,
    selectStudyCard,
  } = usePlanner();
  const [searchOpen, setSearchOpen] = useState(false);
  const query = search.trim().toLowerCase();
  const matches = (value: string) => value.toLowerCase().includes(query);
  const searchResults: SearchResult[] = query
    ? [
        ...studyCards
          .filter((card) => matches(card.title) || matches(card.subject))
          .map((card) => ({
            key: `study-${card.id}`,
            title: card.title,
            detail: `${card.subject} · Waktu belajar`,
            page: 'dashboard' as const,
            studyCardId: card.id,
          })),
        ...tasks
          .filter((task) => matches(task.title) || matches(task.subject) || matches(task.customLabel))
          .map((task) => ({
            key: `task-${task.id}`,
            title: task.title,
            detail: `${task.subject} · Tugas`,
            page: 'tasks' as const,
          })),
        ...Object.entries(schedule).flatMap(([semester, items]) =>
          items
            .filter((item) => matches(item.subject) || matches(item.room) || matches(item.day))
            .map((item) => ({
              key: `schedule-${semester}-${item.id}`,
              title: item.subject,
              detail: `Jadwal ${item.day} · ${item.startTime}`,
              page: 'schedule' as const,
            })),
        ),
        ...Object.entries(calendarEvents).flatMap(([day, events]) =>
          events
            .filter((event) => matches(event.title) || matches(event.type))
            .map((event) => ({
              key: `calendar-${day}-${event.title}`,
              title: event.title,
              detail: `Kalender · ${new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }).format(new Date(`${day}T00:00:00`))} · ${event.time}`,
              page: 'calendar' as const,
            })),
        ),
        ...reminders
          .filter((reminder) => matches(reminder.title) || matches(reminder.label) || matches(reminder.note))
          .map((reminder) => ({
            key: `reminder-${reminder.id}`,
            title: reminder.title,
            detail: `${reminder.label} · Pengingat`,
            page: 'reminders' as const,
          })),
      ].slice(0, 7)
    : [];

  const selectSearchResult = (result: SearchResult) => {
    if (result.studyCardId) selectStudyCard(result.studyCardId);
    setPage(result.page);
    setSearchOpen(false);
    if (result.page !== 'tasks') setSearch('');
  };

  const resultsId = compact ? 'mobile-global-search-results' : 'global-search-results';

  return (
    <div className="relative min-w-0 flex-1">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D687D]" />
      <input
        type="text"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setSearchOpen(true);
        }}
        onFocus={() => setSearchOpen(true)}
        onBlur={() => setSearchOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setSearchOpen(false);
          if (event.key === 'Enter' && searchResults[0]) {
            event.preventDefault();
            selectSearchResult(searchResults[0]);
          }
        }}
        placeholder={compact ? 'Cari...' : 'Cari tugas, jadwal, atau pelajaran...'}
        aria-label="Cari tugas, jadwal, atau pelajaran"
        aria-autocomplete="list"
        aria-expanded={searchOpen && query.length > 0}
        aria-controls={resultsId}
        autoComplete="off"
        className={
          compact
            ? 'h-10 w-full rounded-xl border border-[#B3B9BF]/50 bg-[#F7FAFC] pl-9 pr-3 text-sm text-[#052948] placeholder:text-[#4D687D]/65 outline-none focus:border-[#052948]'
            : 'w-full rounded-2xl border border-[#B3B9BF]/50 bg-white/95 py-2 pl-10 pr-4 text-xs text-[#052948] shadow-2xs transition-all hover:bg-white focus:border-[#052948] focus:bg-white focus:outline-none sm:text-sm'
        }
      />
      {searchOpen && query && (
        <div
          id={resultsId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-[#B3B9BF]/50 bg-white p-2 shadow-xl"
        >
          {searchResults.length ? (
            searchResults.map((result) => (
              <button
                key={result.key}
                type="button"
                role="option"
                aria-selected="false"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSearchResult(result)}
                className="flex w-full flex-col items-start rounded-xl px-3 py-2 text-left hover:bg-[#052948]/5 focus:bg-[#052948]/5 focus:outline-none"
              >
                <span className="text-sm font-bold text-[#052948]">{result.title}</span>
                <span className="text-xs font-medium text-[#4D687D]">{result.detail}</span>
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-[#4D687D]">Tidak ada hasil untuk “{search.trim()}”.</p>
          )}
        </div>
      )}
    </div>
  );
}
