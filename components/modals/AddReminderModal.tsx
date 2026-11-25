'use client';

import { useState, type FormEvent } from 'react';
import { usePlanner } from '@/context/PlannerContext';
import ColorField from '@/components/ui/ColorField';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ModalActions from '@/components/ui/ModalActions';
import type { ReminderDay, ReminderLeadUnit, ReminderRepeat } from '@/lib/types';
import { formatReminderTime } from '@/lib/utils';
import { inputCls, selectCls } from '@/lib/styles';

function getDefaultScheduledAt(isDummyAccount: boolean): string {
  const date = new Date();
  if (isDummyAccount) {
    date.setTime(date.getTime() + 60 * 60 * 1000);
    date.setMinutes(0, 0, 0);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

const REMINDER_DAYS: ReminderDay[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function AddReminderModal() {
  const { addReminder, updateReminder, closeModal, modal, isDummyAccount } = usePlanner();
  const reminder = modal.reminderToEdit;
  const [label, setLabel] = useState(reminder?.label ?? '');
  const [title, setTitle] = useState(reminder?.title ?? '');
  const [scheduledAt, setScheduledAt] = useState(
    reminder?.scheduledAt ?? getDefaultScheduledAt(isDummyAccount),
  );
  const [advanceValue, setAdvanceValue] = useState(
    String(reminder?.leadValue ?? (isDummyAccount ? 15 : 0)),
  );
  const [advanceUnit, setAdvanceUnit] = useState<ReminderLeadUnit>(reminder?.leadUnit ?? 'minutes');
  const [repeat, setRepeat] = useState<ReminderRepeat>(reminder?.repeat ?? 'once');
  const [repeatDays, setRepeatDays] = useState<ReminderDay[]>(reminder?.repeatDays ?? []);
  const [repeatDaysError, setRepeatDaysError] = useState(false);
  const [note, setNote] = useState(reminder?.note ?? '');
  const [color, setColor] = useState(reminder?.colorHex ?? '#791A0A');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const advance = Number(advanceValue);
    if (!Number.isFinite(advance) || advance < 0) return;
    if (repeat === 'custom' && repeatDays.length === 0) {
      setRepeatDaysError(true);
      return;
    }

    const input = {
      label: label.trim(),
      title: title.trim(),
      time: formatReminderTime(scheduledAt),
      scheduledAt,
      leadValue: advance,
      leadUnit: advanceUnit,
      repeat,
      repeatDays: repeat === 'custom' ? repeatDays : [],
      note: note.trim(),
      colorHex: color,
    };

    if (reminder) updateReminder(reminder.id, input);
    else addReminder(input);
    closeModal();
  };

  const toggleRepeatDay = (day: ReminderDay) => {
    const alreadySelected = repeatDays.includes(day);
    setRepeatDays((days) => (alreadySelected ? days.filter((selected) => selected !== day) : [...days, day]));
    if (!alreadySelected) setRepeatDaysError(false);
  };

  return (
    <Modal title={reminder ? 'Edit Pengingat' : 'Atur Pengingat Baru'} onClose={closeModal}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Jenis Label Pengingat (Isi Bebas)">
          <input
            type="text"
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Contoh: Deadline Besok!, Ulangan Harian, Praktikum"
            className={inputCls}
          />
        </Field>
        <Field label="Judul Pengingat">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Bawa Jas Lab & Laporan Praktikum"
            className={inputCls}
          />
        </Field>
        <Field label="Tanggal dan waktu pengingat">
          <input
            type="datetime-local"
            required
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Ingatkan sebelum waktu tersebut">
          <div className="grid grid-cols-[minmax(0,1fr)_112px] gap-2">
            <input
              type="number"
              min={0}
              step={1}
              required
              value={advanceValue}
              onChange={(e) => setAdvanceValue(e.target.value)}
              aria-label="Waktu sebelum pengingat"
              className={inputCls}
            />
            <select
              value={advanceUnit}
              onChange={(e) => setAdvanceUnit(e.target.value as ReminderLeadUnit)}
              aria-label="Satuan waktu pengingat"
              className={selectCls}
            >
              <option value="minutes">Menit</option>
              <option value="hours">Jam</option>
              <option value="days">Hari</option>
            </select>
          </div>
          <p className="mt-1 text-[11px] text-[#4D687D]">Pilih berapa lama sebelum waktu pengingat di atas.</p>
        </Field>
        <Field label="Ulangi pengingat">
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value as ReminderRepeat)}
            className={selectCls}
          >
            <option value="once">Sekali</option>
            <option value="daily">Harian</option>
            <option value="weekdays">Senin sampai Jumat</option>
            <option value="custom">Kustom</option>
          </select>
        </Field>
        {repeat === 'custom' && (
          <Field label="Pilih hari kustom">
            <div role="group" aria-label="Hari pengingat kustom" className="flex flex-wrap gap-2">
              {REMINDER_DAYS.map((day) => {
                const selected = repeatDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleRepeatDay(day)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                      selected
                        ? 'border-[#052948] bg-[#052948] text-white'
                        : 'border-[#B3B9BF] bg-white text-[#4D687D] hover:border-[#052948] hover:text-[#052948]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {repeatDaysError && (
              <p role="alert" className="mt-1 text-[11px] font-semibold text-[#791A0A]">
                Pilih setidaknya satu hari.
              </p>
            )}
          </Field>
        )}
        <Field label="Catatan (opsional)">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambahkan catatan untuk pengingat ini"
            rows={3}
            className={inputCls}
          />
        </Field>
        <ColorField label="Warna Pengingat" value={color} onChange={setColor} badgeLabel="Pengingat" />
        <ModalActions
          onCancel={closeModal}
          submitLabel={reminder ? 'Simpan Perubahan' : 'Simpan Pengingat'}
        />
      </form>
    </Modal>
  );
}
