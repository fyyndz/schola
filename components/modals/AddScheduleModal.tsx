'use client';

import { useState, type FormEvent } from 'react';
import { usePlanner } from '@/context/PlannerContext';
import ColorField from '@/components/ui/ColorField';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ModalActions from '@/components/ui/ModalActions';
import { DAYS } from '@/lib/constants';
import { inputCls, inputSmCls, selectCls } from '@/lib/styles';
import type { DayName } from '@/lib/types';

export default function AddScheduleModal() {
  const { modal, addSchedule, closeModal, isDummyAccount } = usePlanner();
  const [day, setDay] = useState<DayName>(modal.scheduleDay);
  const [room, setRoom] = useState('R. XI IPA 2');
  const [startTime, setStartTime] = useState(isDummyAccount ? '07:30' : '00:00');
  const [endTime, setEndTime] = useState(isDummyAccount ? '09:15' : '00:00');
  const [subject, setSubject] = useState('');
  const [color, setColor] = useState('#4D687D');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addSchedule({ day, room: room.trim(), startTime, endTime, subject: subject.trim(), colorHex: color });
    closeModal();
  };

  return (
    <Modal title="Tambah Jadwal Pelajaran" onClose={closeModal}>
      <form onSubmit={submit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Hari">
            <select value={day} onChange={(e) => setDay(e.target.value as DayName)} className={selectCls}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ruangan / Lokasi">
            <input type="text" required value={room} onChange={(e) => setRoom(e.target.value)} className={inputSmCls} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Jam Mulai (Bebas)">
            <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputSmCls} />
          </Field>
          <Field label="Jam Selesai (Bebas)">
            <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputSmCls} />
          </Field>
        </div>
        <Field label="Pelajaran / Kegiatan (Isi Bebas)">
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Misal: Matematika, Rapat OSIS, Les Bahasa Inggris"
            className={inputCls}
          />
        </Field>
        <ColorField label="Pilih Warna Jadwal" value={color} onChange={setColor} badgeLabel="Jadwal" />
        <ModalActions onCancel={closeModal} submitLabel="Simpan Jadwal" />
      </form>
    </Modal>
  );
}
