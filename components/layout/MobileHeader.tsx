'use client';

import Image from 'next/image';
import { Bell, Menu, Search, UserRound } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';

export default function MobileHeader() {
  const {
    toggleMobileNav,
    setPage,
    activeRemindersCount,
    firstName,
    profile,
    search,
    setSearch,
  } = usePlanner();
  return (
    <div className="z-30 flex shrink-0 items-center gap-2 bg-white px-3 py-3 border-b border-[#B3B9BF]/40 xl:hidden">
      <div className="flex items-center">
        <button
          onClick={toggleMobileNav}
          aria-label="Buka menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#052948]/10 text-[#052948] hover:bg-[#052948]/20 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D687D]" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari..."
          aria-label="Cari tugas, jadwal, atau pelajaran"
          autoComplete="off"
          className="h-10 w-full rounded-xl border border-[#B3B9BF]/50 bg-[#F7FAFC] pl-9 pr-3 text-sm text-[#052948] placeholder:text-[#4D687D]/65 outline-none focus:border-[#052948]"
        />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => setPage('reminders')}
          aria-label="Pengingat"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#052948]"
        >
          <Bell className="w-4 h-4" />
          {activeRemindersCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#791A0A] text-white text-[9px] font-bold flex items-center justify-center">
              {activeRemindersCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setPage('profile')}
          aria-label="Profile"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#B3B9BF]/45 bg-white p-1 text-white shadow-xs"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#052948]">
            {profile.avatarDataUrl ? (
              <Image
                src={profile.avatarDataUrl}
                alt={`Foto profil ${profile.name}`}
                width={32}
                height={32}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : firstName ? (
              <span className="text-xs font-bold">{firstName.charAt(0).toUpperCase()}</span>
            ) : (
              <UserRound className="h-4 w-4" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
