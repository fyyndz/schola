'use client';

import type { DurationParts } from '@/lib/utils';
import { inputCls } from '@/lib/styles';

interface DurationFieldsProps {
  value: DurationParts;
  onChange: (value: DurationParts) => void;
}

const UNITS: { key: keyof DurationParts; label: string; max?: number }[] = [
  { key: 'hours', label: 'Jam' },
  { key: 'minutes', label: 'Menit', max: 59 },
  { key: 'seconds', label: 'Detik', max: 59 },
];

export default function DurationFields({ value, onChange }: DurationFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {UNITS.map(({ key, label, max }) => (
        <div key={key} className="min-w-0">
          <span className="mb-1 block text-[10px] font-semibold text-[#4D687D]">{label}</span>
          <input
            type="number"
            min={0}
            max={max}
            step={1}
            value={value[key]}
            onChange={(event) => onChange({ ...value, [key]: event.target.value })}
            aria-label={label}
            className={inputCls}
          />
        </div>
      ))}
    </div>
  );
}
