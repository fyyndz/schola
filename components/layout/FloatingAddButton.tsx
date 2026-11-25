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

  return (
    <button
      type="button"
      onClick={openQuickAction}
      title={ACTION_LABELS[page]}
      aria-label={ACTION_LABELS[page]}
      className="sticky top-[calc(100dvh-5rem)] z-40 mb-[-3.5rem] ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#791A0A] text-white shadow-lg shadow-[#791A0A]/30 transition-transform active:scale-95 xl:hidden"
    >
      <Plus className="h-7 w-7 stroke-[2.5]" />
    </button>
  );
}
