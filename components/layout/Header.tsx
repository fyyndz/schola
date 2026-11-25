'use client';

import Image from 'next/image';
import { Bell, UserRound } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import GlobalSearch from './GlobalSearch';

export default function Header() {
  const { setPage, activeRemindersCount, firstName, profile } = usePlanner();

  return (
    <header className="hidden h-16 shrink-0 items-center justify-between gap-[20px] schola-grid-container xl:flex">
      <div className="relative flex-1 min-w-0">
        <GlobalSearch />
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
          className="flex h-10 items-center justify-center gap-2.5 rounded-2xl border border-[#B3B9BF]/45 bg-white p-1 pr-1 shadow-2xs transition-all hover:bg-[#B3B9BF]/15 xl:pr-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#052948] text-xs font-extrabold text-white shadow-2xs">
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
              <span>{firstName.charAt(0).toUpperCase()}</span>
            ) : (
              <UserRound className="h-4 w-4" />
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
