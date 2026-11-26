'use client';

import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md';
}

export default function Modal({ title, onClose, children, size = 'md' }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#052948]/50 p-2 backdrop-blur-xs sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-[28px] bg-white p-4 shadow-2xl animate-pop sm:p-6 ${size === 'sm' ? 'max-w-sm' : 'max-w-md'}`}
      >
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3 sm:mb-4">
          <h3 className="min-w-0 text-base font-extrabold text-[#052948] sm:text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#4D687D] hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
