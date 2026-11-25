'use client';

import { usePlanner } from '@/context/PlannerContext';

export default function Toast() {
  const { toast } = usePlanner();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#052948] text-white px-5 py-3 rounded-full shadow-xl text-xs font-bold flex items-center gap-2.5 transition-all duration-300 ${
        toast.visible ? '' : 'opacity-0 pointer-events-none'
      }`}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400" />
      <span>{toast.message}</span>
    </div>
  );
}
