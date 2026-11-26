'use client';

import { Plus } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import type { PageKey } from '@/lib/types';

const ACTION_LABELS: Record<PageKey, string> = {
  dashboard: 'Tambah waktu belajar',
  tasks: 'Tambah tugas',
  schedule: 'Tambah jadwal',
  calendar: 'Tambah agenda',
  reminders: 'Tambah pengingat',
  profile: 'Edit profil',
};

export default function FloatingAddButton() {
  const { page, openQuickAction } = usePlanner();

  if (page === 'profile') return null;

  return (
    <button
      type="button"
      onClick={openQuickAction}
      aria-label={ACTION_LABELS[page]}
      className="group sticky top-[calc(100dvh-11rem)] z-40 mb-4 ml-auto mr-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#791A0A] text-white shadow-lg shadow-[#791A0A]/30 transition-transform active:scale-95"
    >
      <span className="pointer-events-none absolute right-full top-1/2 z-50 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#052948] px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {ACTION_LABELS[page]}
      </span>
      <Plus className="h-7 w-7 stroke-[2.5]" />
    </button>
  );
}
