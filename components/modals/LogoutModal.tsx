'use client';

import { LogOut } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';

export default function LogoutModal() {
  const { closeModal, confirmLogout, firstName } = usePlanner();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#052948]/50 p-2 backdrop-blur-xs sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keluar dari Schola"
        className="max-h-[calc(100dvh-1rem)] w-full max-w-sm overflow-y-auto rounded-[28px] bg-white p-4 text-center shadow-2xl animate-pop sm:p-6"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#791A0A]/10 text-[#791A0A] flex items-center justify-center mx-auto mb-3">
          <LogOut className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-extrabold text-[#052948]">Keluar dari Schola?</h3>
        <p className="text-xs text-[#4D687D] mt-1 mb-5">
          Semua catatan tugas dan target belajar {firstName} tetap tersimpan aman.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#052948] text-xs font-bold"
          >
            Batal
          </button>
          <button
            onClick={confirmLogout}
            className="px-5 py-2.5 rounded-full bg-[#791A0A] hover:bg-[#5E1307] text-white text-xs font-extrabold"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
