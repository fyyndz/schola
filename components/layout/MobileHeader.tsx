'use client';

import Image from 'next/image';
import { Bell, Menu } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';

export default function MobileHeader() {
  const { toggleMobileNav, setPage, activeRemindersCount, firstName, profile } = usePlanner();
  return (
    <div className="xl:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#B3B9BF]/40 shrink-0 z-30">
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleMobileNav}
          aria-label="Buka menu"
          className="p-2 rounded-xl bg-[#052948]/10 text-[#052948] hover:bg-[#052948]/20 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-extrabold text-[#052948] leading-none">Schola</h1>
          <p className="text-[10px] font-semibold text-[#4D687D]">Student Planner</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage('reminders')}
          aria-label="Pengingat"
          className="relative p-2 rounded-xl bg-slate-100 text-[#052948]"
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
          className="w-8 h-8 rounded-full bg-[#052948] text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden"
        >
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
        </button>
      </div>
    </div>
  );
}
