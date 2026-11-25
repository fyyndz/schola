'use client';

import { useState, type FormEvent } from 'react';
import { usePlanner } from '@/context/PlannerContext';
import DurationFields from '@/components/ui/DurationFields';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ModalActions from '@/components/ui/ModalActions';
import { durationPartsToHours, formatHours } from '@/lib/utils';

export default function StudyDetailModal() {
  const { studyCards, focusHours, focusGoalHours, focusTopicIndex, logStudySession, closeModal } = usePlanner();
  const [cardId, setCardId] = useState(studyCards[focusTopicIndex]?.id ?? studyCards[0]?.id ?? '');
  const [duration, setDuration] = useState({ hours: '0', minutes: '30', seconds: '0' });
  const [durationError, setDurationError] = useState(false);

  const pct = Math.min(100, Math.round((focusHours / focusGoalHours) * 100));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const hours = durationPartsToHours(duration);
    if (hours <= 0) {
      setDurationError(true);
      return;
    }
    logStudySession(cardId, hours);
    closeModal();
  };

  return (
    <Modal title="Detail & Catat Waktu Belajar" onClose={closeModal}>
      <div className="p-4 rounded-2xl bg-[#052948]/5 border border-[#052948]/15 mb-4">
        <div className="flex justify-between text-xs font-bold text-[#052948] mb-1">
          <span>Progres Hari Ini</span>
          <span>
            {formatHours(focusHours)} / {formatHours(focusGoalHours)} Jam
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#B3B9BF]/40 rounded-full overflow-hidden">
          <div className="h-full bg-[#052948] rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Pilih Kartu Belajar">
          <select
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-[#B3B9BF] text-sm bg-white focus:border-[#052948] focus:outline-none"
          >
            {studyCards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.subject})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Durasi Tambahan">
          <DurationFields
            value={duration}
            onChange={(next) => {
              setDuration(next);
              setDurationError(false);
            }}
          />
          {durationError && (
            <p role="alert" className="mt-1 text-[11px] font-semibold text-[#791A0A]">
              Masukkan durasi lebih dari 0.
            </p>
          )}
        </Field>
        <ModalActions onCancel={closeModal} cancelLabel="Tutup" submitLabel="+ Tambah Waktu Belajar" tone="maroon" />
      </form>
    </Modal>
  );
}
