'use client';

import { AlertOctagon, BellRing, Check, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { formatReminderRepeat, getDeadlineStatus, getDynamicStyles, isReminderOverdue } from '@/lib/utils';

export default function RemindersPage() {
  const {
    tasks,
    reminders,
    now,
    openModal,
    openReminderEditor,
    extendTask,
    toggleTaskDone,
    toggleReminder,
    deleteReminder,
    activeRemindersCount,
  } = usePlanner();

  const overdueTasks = tasks.filter((t) => !t.completed && t.dueTimestamp <= now);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#052948] tracking-tight">Pengingat Tugas</h1>
          <p className="text-xs font-semibold text-[#4D687D] mt-0.5">
            Notifikasi aktif dan tenggat waktu penting langsung di bagian atas
          </p>
        </div>
        <button
          onClick={() => openModal('addReminderModal')}
          className="px-4 py-2.5 rounded-full bg-[#052948] hover:bg-[#4D687D] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Atur Pengingat</span>
        </button>
      </div>

      {/* Top notification banner */}
      <div className="bg-gradient-to-r from-[#052948] via-[#07365E] to-[#4D687D] rounded-[24px] p-4 sm:p-5 text-white shadow-soft mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center relative shrink-0">
            <BellRing className="w-6 h-6 text-white" />
            {activeRemindersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#791A0A] text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                {activeRemindersCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold">Pusat Notifikasi Aktif ({activeRemindersCount} Pengingat)</h3>
            <p className="text-xs text-white/85 mt-0.5">
              Alarm pengingat tugas, jadwal praktikum, dan peringatan lewat batas waktu selalu siaga.
            </p>
          </div>
        </div>
      </div>

      {/* Overdue alerts */}
      {overdueTasks.length > 0 && (
        <div className="mb-4 space-y-2.5">
          {overdueTasks.map((ot) => {
            const dl = getDeadlineStatus(ot.dueTimestamp, false, now);
            return (
              <div
                key={ot.id}
                className="bg-red-50/90 border border-red-300 rounded-[22px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <AlertOctagon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-600 text-white uppercase">
                        Lewat Batas Waktu!
                      </span>
                      <span className="text-xs font-bold text-red-600">{dl.text}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-[#052948] mt-1">{ot.title}</h4>
                    <p className="text-xs text-[#4D687D]">Topik: {ot.subject} • Segera selesaikan atau perpanjang tenggat.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => extendTask(ot.id)}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-red-100 text-red-600 border border-red-300 text-xs font-extrabold"
                  >
                    +24 Jam
                  </button>
                  <button
                    onClick={() => toggleTaskDone(ot.id)}
                    className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reminder cards */}
      <div className="schola-12-grid">
        {reminders.map((rem) => {
          const st = getDynamicStyles(rem.colorHex);
          const overdue = isReminderOverdue(rem, now);
          return (
            <div
              key={rem.id}
              className={`col-span-12 md:col-span-6 rounded-[22px] p-4 border shadow-2xs flex flex-col justify-between gap-3 ${
                rem.done
                  ? 'bg-[#EEF1F4] border-[#B3B9BF]/60 opacity-70'
                  : 'bg-white border-[#B3B9BF]/45'
              }`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span style={st.badgeStyle} className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border">
                    {rem.label}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      overdue ? 'rounded-full border border-red-300 bg-red-50 px-2 py-1 text-red-600' : 'text-[#4D687D]'
                    }`}
                  >
                    ⏰ {rem.time}
                  </span>
                </div>
                <h4 className={`text-sm font-extrabold pt-1 ${rem.done ? 'line-through text-[#4D687D]' : 'text-[#052948]'}`}>
                  {rem.title}
                </h4>
                {overdue && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-extrabold text-white">
                    <AlertOctagon className="h-3 w-3" />
                    Lewat Batas Waktu
                  </span>
                )}
                <p className="text-xs text-[#4D687D]">Ulangi: {formatReminderRepeat(rem.repeat, rem.repeatDays)}</p>
                <p className="text-xs text-[#4D687D]">
                  Ingatkan{' '}
                  {rem.leadValue === 0
                    ? 'tepat pada waktunya'
                    : `${rem.leadValue} ${rem.leadUnit === 'minutes' ? 'menit' : rem.leadUnit === 'hours' ? 'jam' : 'hari'} sebelumnya`}
                </p>
                {rem.note && <p className="text-xs text-[#4D687D]">{rem.note}</p>}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!rem.done) openReminderEditor(rem);
                    }}
                    disabled={rem.done}
                    aria-label={`Edit pengingat ${rem.title}`}
                    title={rem.done ? 'Pengingat selesai tidak dapat diedit' : 'Edit pengingat'}
                    className="relative z-10 w-8 h-8 rounded-full bg-[#052948]/8 text-[#052948] enabled:hover:bg-[#052948]/15 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReminder(rem.id)}
                    aria-label={`Hapus pengingat ${rem.title}`}
                    title="Hapus pengingat"
                    className="relative z-10 w-8 h-8 rounded-full bg-[#791A0A]/8 text-[#791A0A] hover:bg-red-600 hover:text-white hover:shadow-sm active:bg-red-700 cursor-pointer flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {rem.done ? (
                  <button
                    type="button"
                    onClick={() => toggleReminder(rem.id)}
                    aria-label="Kembalikan pengingat"
                    title="Kembalikan pengingat"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#052948]/10 px-3 py-1.5 text-xs font-extrabold text-[#052948] hover:bg-[#052948] hover:text-white transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleReminder(rem.id)}
                    aria-label="Tandai pengingat selesai"
                    title="Tandai pengingat selesai"
                    className="px-3.5 py-1.5 rounded-full bg-[#052948]/10 hover:bg-[#052948] text-[#052948] hover:text-white text-xs font-extrabold transition-all"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {reminders.length === 0 && (
          <p className="col-span-12 rounded-2xl bg-white p-6 text-center text-sm text-[#4D687D]">
            Belum ada pengingat. Tekan “Atur Pengingat” untuk menambahkan.
          </p>
        )}
      </div>
    </>
  );
}
