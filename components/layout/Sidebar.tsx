'use client';

import Image from 'next/image';
import {
  BellRing,
  CalendarDays,
  CheckSquare,
  Clock,
  LayoutGrid,
  LogOut,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import type { PageKey } from '@/lib/types';

const NAV: { key: PageKey; label: string; icon: LucideIcon }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'tasks', label: 'Manajemen Tugas', icon: CheckSquare },
  { key: 'schedule', label: 'Jadwal Pelajaran', icon: Clock },
  { key: 'calendar', label: 'Kalender Akademik', icon: CalendarDays },
  { key: 'reminders', label: 'Pengingat Tugas', icon: BellRing },
  { key: 'profile', label: 'Profile', icon: UserRound },
];

const tooltipCls =
  'nav-tooltip hidden xl:block fixed left-[92px] px-3 py-1.5 rounded-xl text-white text-xs font-semibold shadow-lg whitespace-nowrap z-50';

export default function Sidebar() {
  const { page, setPage, mobileNavOpen, activeTasksCount, activeRemindersCount, openModal } = usePlanner();

  return (
    <aside
      className={`fixed xl:static inset-y-0 left-0 z-50 w-[260px] xl:w-[86px] bg-white border-r border-[#B3B9BF]/40 flex flex-col items-start xl:items-center justify-between py-6 px-3 xl:px-0 transform ${
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
      } xl:translate-x-0 transition-transform duration-300 shrink-0 select-none`}
    >
      {/* Brand */}
      <button
        type="button"
        onClick={() => setPage('dashboard')}
        aria-label="Kembali ke Dashboard"
        className="group mx-3 xl:mx-auto flex h-[43px] w-[30px] items-center justify-center bg-transparent p-0"
      >
        <Image
          src="/images/schola-sidebar-mark.png"
          alt=""
          width={30}
          height={43}
          priority
          className="h-full w-full object-contain transition-transform group-hover:rotate-6"
        />
      </button>

      {/* Primary nav */}
      <nav className="flex w-full flex-col items-stretch gap-2 xl:items-center">
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = page === key;
          return (
            <button
              key={key}
              onClick={() => setPage(key)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={`sidebar-btn relative flex h-11 w-full items-center justify-start gap-3 rounded-xl px-2 transition-all xl:justify-center xl:gap-0 xl:px-0 ${
                active ? 'text-[#052948]' : 'text-[#4D687D] hover:text-[#052948]'
              }`}
            >
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3.5px] h-6 bg-[#052948] rounded-l-full" />
              )}
              <div
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all ${
                  active ? 'bg-[#052948]/10' : 'hover:bg-slate-100'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {key === 'tasks' && activeTasksCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#791A0A]" />
                )}
                {key === 'reminders' && activeRemindersCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#791A0A] text-white text-[8px] font-bold flex items-center justify-center">
                    {activeRemindersCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold xl:hidden">{label}</span>
              <span className={`${tooltipCls} bg-[#052948]`}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => openModal('logoutModal')}
        aria-label="Keluar"
        className="sidebar-btn relative flex h-11 w-full items-center justify-start gap-3 rounded-xl px-2 text-[#4D687D] transition-colors hover:text-[#791A0A] xl:justify-center xl:gap-0 xl:px-0"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors hover:bg-[#791A0A]/10">
          <LogOut className="w-[18px] h-[18px]" />
        </div>
        <span className="text-sm font-semibold xl:hidden">Keluar</span>
        <span className={`${tooltipCls} bg-[#791A0A]`}>Keluar</span>
      </button>
    </aside>
  );
}
