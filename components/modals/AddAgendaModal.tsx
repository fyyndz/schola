'use client';

import { useState, type FormEvent } from 'react';
import { usePlanner } from '@/context/PlannerContext';
import ColorField from '@/components/ui/ColorField';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ModalActions from '@/components/ui/ModalActions';
import { inputCls, inputSmCls } from '@/lib/styles';

export default function AddAgendaModal() {
  const { modal, addAgenda, closeModal } = usePlanner();
  const [day, setDay] = useState(String(modal.agendaDay));
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('#052948');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addAgenda(day, {
      title: title.trim(),
      time: time.trim(),
      type: type.trim(),
      colorHex: color,
    });
    closeModal();
  };

  return (
    <Modal title="Tambah Agenda Akademik" onClose={closeModal}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Tanggal Agenda">
          <input type="date" required value={day} onChange={(e) => setDay(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Judul Kegiatan / Agenda">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Belajar Ulangan Harian Fisika"
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Waktu">
            <input type="text" required value={time} onChange={(e) => setTime(e.target.value)} placeholder="15:30 - 17:00" className={inputSmCls} />
          </Field>
          <Field label="Label Kategori">
            <input type="text" required value={type} onChange={(e) => setType(e.target.value)} placeholder="Misal: Ulangan, OSIS" className={inputSmCls} />
          </Field>
        </div>
        <ColorField label="Warna Agenda" value={color} onChange={setColor} badgeLabel="Agenda" />
        <ModalActions onCancel={closeModal} submitLabel="Simpan Agenda" />
      </form>
    </Modal>
  );
}
