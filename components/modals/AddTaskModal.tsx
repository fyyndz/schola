'use client';

import { useState, type FormEvent } from 'react';
import { usePlanner } from '@/context/PlannerContext';
import ColorField from '@/components/ui/ColorField';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ModalActions from '@/components/ui/ModalActions';
import { inputCls, inputSmCls, selectCls } from '@/lib/styles';
import type { DeadlinePreset, Priority } from '@/lib/types';

export default function AddTaskModal() {
  const { addTask, closeModal } = usePlanner();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<Priority>('Tinggi');
  const [customLabel, setCustomLabel] = useState('');
  const [color, setColor] = useState('#791A0A');
  const [preset, setPreset] = useState<DeadlinePreset>('hours_3');
  const [customDatetime, setCustomDatetime] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addTask({
      title: title.trim(),
      subject: subject.trim(),
      priority,
      customLabel: customLabel.trim(),
      colorHex: color,
      preset,
      customDatetime,
    });
    closeModal();
  };

  return (
    <Modal title="Tambah Tugas Baru" onClose={closeModal}>
      <form onSubmit={submit} className="space-y-3.5">
        <Field label="Judul Tugas">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Merangkum Bab 4 Sejarah / Proposal OSIS"
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Pelajaran / Topik">
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ketik topik bebas..."
              className={inputSmCls}
            />
          </Field>
          <Field label="Prioritas">
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={selectCls}>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
            </select>
          </Field>
        </div>
        <Field label="Jenis Label Tugas (Isi Bebas)">
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Contoh: Deadline Besok, Ulangan Harian, Kelompok"
            className={inputCls}
          />
        </Field>
        <ColorField label="Pilih Warna Kartu / Label" value={color} onChange={setColor} badgeLabel="Label" />
        <Field label="Batas Waktu (Countdown)">
          <select value={preset} onChange={(e) => setPreset(e.target.value as DeadlinePreset)} className={selectCls}>
            <option value="hours_3">Tinggal 3 Jam Lagi (Hari Ini)</option>
            <option value="tomorrow">Deadline Besok (24 Jam)</option>
            <option value="days_2">Tinggal 2 Hari Lagi</option>
            <option value="days_4">Tinggal 4 Hari Lagi</option>
            <option value="overdue_test">Simulasi Lewat Batas Waktu (2 Jam Lalu)</option>
            <option value="custom">Pilih Tanggal & Jam Spesifik...</option>
          </select>
        </Field>
        {preset === 'custom' && (
          <Field label="Tanggal & Jam Deadline">
            <input
              type="datetime-local"
              value={customDatetime}
              onChange={(e) => setCustomDatetime(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl border border-[#B3B9BF] text-sm focus:border-[#052948] focus:outline-none"
            />
          </Field>
        )}
        <ModalActions onCancel={closeModal} submitLabel="Simpan Tugas" />
      </form>
    </Modal>
  );
}
