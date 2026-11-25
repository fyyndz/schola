interface ModalActionsProps {
  onCancel: () => void;
  submitLabel: string;
  cancelLabel?: string;
  tone?: 'navy' | 'maroon';
}

export default function ModalActions({ onCancel, submitLabel, cancelLabel = 'Batal', tone = 'navy' }: ModalActionsProps) {
  return (
    <div className="pt-2 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2.5 rounded-full text-xs font-bold text-[#4D687D] hover:bg-slate-100"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        className={`px-5 py-2.5 rounded-full text-white text-xs font-extrabold shadow-sm ${
          tone === 'maroon' ? 'bg-[#791A0A] hover:bg-[#5E1307]' : 'bg-[#052948] hover:bg-[#4D687D]'
        }`}
      >
        {submitLabel}
      </button>
    </div>
  );
}
