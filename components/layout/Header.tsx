'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import type { PageKey } from '@/lib/types';

interface SearchResult {
  key: string;
  title: string;
  detail: string;
  page: PageKey;
  studyCardId?: string;
}

export default function Header() {
  const {
    search,
    setSearch,
    setPage,
    activeRemindersCount,
    firstName,
    profile,
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

  return (
    <header className="h-16 schola-grid-container flex items-center justify-between gap-[20px] shrink-0">
      <div className="relative flex-1 min-w-0">
        <Search className="w-4 h-4 text-[#4D687D] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSearchOpen(false);
            if (e.key === 'Enter' && searchResults[0]) {
              e.preventDefault();
              selectSearchResult(searchResults[0]);
            }
          }}
          placeholder="Cari tugas, jadwal, atau pelajaran..."
          aria-label="Cari tugas, jadwal, atau pelajaran"
          aria-autocomplete="list"
          aria-expanded={searchOpen && query.length > 0}
          aria-controls="global-search-results"
          autoComplete="off"
          className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/95 hover:bg-white focus:bg-white text-xs sm:text-sm text-[#052948] placeholder:text-[#4D687D]/65 border border-[#B3B9BF]/50 focus:border-[#052948] focus:outline-none shadow-2xs transition-all"
        />
        {searchOpen && query && (
          <div
            id="global-search-results"
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
                  onMouseDown={(e) => e.preventDefault()}
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

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => setPage('reminders')}
          title="Pengingat Tugas & Notifikasi"
          aria-label="Pengingat"
          className="relative w-10 h-10 rounded-2xl bg-white hover:bg-[#B3B9BF]/15 text-[#4D687D] hover:text-[#052948] border border-[#B3B9BF]/45 shadow-2xs flex items-center justify-center transition-all"
        >
          <Bell className="w-[18px] h-[18px]" />
          {activeRemindersCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#791A0A] text-white text-[10px] font-extrabold flex items-center justify-center">
              {activeRemindersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setPage('profile')}
          className="flex items-center gap-2.5 p-1 pr-3 rounded-2xl bg-white hover:bg-[#B3B9BF]/15 border border-[#B3B9BF]/45 shadow-2xs transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#052948] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs overflow-hidden">
            {profile.avatarDataUrl ? (
              <Image
                src={profile.avatarDataUrl}
                alt={`Foto profil ${profile.name}`}
                width={32}
                height={32}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{firstName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-extrabold text-[#052948] block leading-none">{firstName}</span>
            <span className="text-[10px] font-bold text-[#4D687D] block mt-0.5">{profile.studentClass}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
