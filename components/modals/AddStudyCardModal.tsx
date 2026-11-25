'use client';

import { useState, type FormEvent } from 'react';
import { usePlanner } from '@/context/PlannerContext';
import ColorField from '@/components/ui/ColorField';
import DurationFields from '@/components/ui/DurationFields';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ModalActions from '@/components/ui/ModalActions';
import { inputCls } from '@/lib/styles';
import { durationPartsToHours, hoursToDurationParts } from '@/lib/utils';

export default function AddStudyCardModal() {
  const { addStudyCard, updateStudyCard, closeModal, modal, isDummyAccount } = usePlanner();
  const card = modal.studyCardToEdit;
  const [title, setTitle] = useState(card?.title ?? '');
  const [subject, setSubject] = useState(card?.subject ?? '');
  const [done, setDone] = useState(() =>
    hoursToDurationParts(card?.doneHours ?? (isDummyAccount ? 1 : 0)),
  );
  const [goal, setGoal] = useState(() =>
    hoursToDurationParts(card?.goalHours ?? (isDummyAccount ? 4 : 0)),
  );
  const [goalError, setGoalError] = useState(false);
  const [color, setColor] = useState(card?.colorHex ?? '#052948');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const doneHours = durationPartsToHours(done);
    const goalHours = durationPartsToHours(goal);
    if (goalHours <= 0) {
      setGoalError(true);
      return;
    }

    const input = {
      title: title.trim(),
      subject: subject.trim(),
      doneHours,
      goalHours,
      colorHex: color,
    };
    if (card) updateStudyCard(card.id, input);
    else addStudyCard(input);
    closeModal();
  };

  return (
    <Modal title={card ? 'Edit Waktu Belajar' : 'Tambah Waktu Belajar'} onClose={closeModal}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Judul Target Belajar">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Latihan UTBK, Fisika Kuantum, Debat..."
            className={inputCls}
          />
        </Field>
        <Field label="Label Pelajaran / Topik (Isi Bebas)">
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ketik topik apa saja (misal: Organisasi, Coding, Kimia)"
            className={inputCls}
          />
        </Field>
        <div className="space-y-3">
          <Field label="Sudah Belajar">
            <DurationFields value={done} onChange={setDone} />
          </Field>
          <Field label="Target Belajar">
            <DurationFields
              value={goal}
              onChange={(next) => {
                setGoal(next);
                setGoalError(false);
              }}
            />
            {goalError && (
              <p role="alert" className="mt-1 text-[11px] font-semibold text-[#791A0A]">
                Target belajar harus lebih dari 0.
              </p>
            )}
          </Field>
        </div>
        <ColorField
          label="Pilih Warna Sesuai Selera"
          value={color}
          onChange={setColor}
          badgeLabel="Pratinjau"
          hint="Klik kotak warna untuk bebas memilih"
        />
        <ModalActions onCancel={closeModal} submitLabel={card ? 'Simpan Perubahan' : 'Simpan Kartu'} />
      </form>
    </Modal>
  );
}
