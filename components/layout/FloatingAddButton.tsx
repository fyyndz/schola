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
  const actionLabel = ACTION_LABELS[page];
  return (
    <button
      onClick={openQuickAction}
      title={actionLabel}
      aria-label={actionLabel}
      className="group absolute bottom-6 right-6 xl:right-[10px] z-30 w-12 h-12 rounded-full bg-[#791A0A] hover:bg-[#5E1307] text-white shadow-lg shadow-[#791A0A]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
    >
      <Plus className="w-6 h-6 stroke-[2.5]" />
      <span
        role="tooltip"
        className="pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#052948] px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {actionLabel}
      </span>
    </button>
  );
}
