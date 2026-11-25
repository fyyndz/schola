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
    <div className="fixed inset-0 bg-[#052948]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`bg-white rounded-[28px] w-full p-6 shadow-2xl animate-pop ${size === 'sm' ? 'max-w-sm' : 'max-w-md'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-[#052948]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#4D687D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
