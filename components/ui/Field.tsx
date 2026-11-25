import type { ReactNode } from 'react';

export default function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#052948] mb-1">{label}</label>
      {children}
    </div>
  );
}
