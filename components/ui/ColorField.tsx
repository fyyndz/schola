'use client';

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  badgeLabel: string;
  hint?: string;
}

export default function ColorField({ label, value, onChange, badgeLabel, hint }: ColorFieldProps) {
  const upper = value.toUpperCase();
  return (
    <div>
      <label className="block text-xs font-bold text-[#052948] mb-1.5">{label}</label>
      <div className="flex items-center gap-3 p-2 rounded-2xl border border-[#B3B9BF]/60 bg-slate-50">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-xl border-0 cursor-pointer bg-transparent"
        />
        <div className="flex-1">
          <span className="text-xs font-extrabold text-[#052948] uppercase block">{upper}</span>
          {hint && <span className="text-[11px] text-[#4D687D]">{hint}</span>}
        </div>
        <span style={{ backgroundColor: upper }} className="px-3 py-1 rounded-full text-white text-[10px] font-bold">
          {badgeLabel}
        </span>
      </div>
    </div>
  );
}
