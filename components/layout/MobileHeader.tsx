'use client';

import Image from 'next/image';
import { Bell, Menu, UserRound } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import GlobalSearch from './GlobalSearch';

export default function MobileHeader() {
  const {
    toggleMobileNav,
    setPage,
    activeRemindersCount,
    firstName,
    profile,
  } = usePlanner();
  return (
    <div
      className="sticky top-0 z-30 flex w-full shrink-0 items-center gap-2 border-b border-[#B3B9BF]/45 bg-white px-3 py-3 shadow-[0_2px_5px_-3px_rgba(5,41,72,0.2)] xl:hidden"
    >
      <div className="flex items-center">
        <button
          onClick={toggleMobileNav}
          aria-label="Buka menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#052948] text-white transition-colors hover:bg-[#4D687D]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <GlobalSearch compact />
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
