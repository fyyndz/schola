'use client';

import { AlertTriangle, Check, CheckCircle2, Flame, Layers, ListTodo, Pencil, Plus, X, type LucideIcon } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { HOUR_MS, TODAY_DAY_NAME, TODAY_LABEL, TODAY_SHORT } from '@/lib/constants';
import { getStudyIcon } from '@/lib/icons';
import type { PageKey } from '@/lib/types';
import { formatHours, getDeadlineStatus, getDynamicStyles } from '@/lib/utils';

export default function DashboardPage() {
  const {
    profile,
    firstName,
    tasks,
    studyCards,
    schedule,
    selectedSemester,
    now,
    setPage,
    openModal,
    openStudyCardEditor,
    quickAddStudyHours,
    removeStudyCard,
    selectStudyCard,
    toggleTaskDone,
    showToast,
  } = usePlanner();

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const overdueTasks = activeTasks.filter((t) => t.dueTimestamp <= now);
  const nearTasks = activeTasks.filter((t) => t.dueTimestamp - now <= 36 * HOUR_MS);
  const todayItems = (schedule[selectedSemester] ?? []).filter((s) => s.day === TODAY_DAY_NAME);
  const distinctTopics = new Set(studyCards.map((c) => c.subject)).size;

  const stats: {
    label: string;
    value: string;
    icon: LucideIcon;
    page: PageKey;
    hover: string;
    iconCls: string;
  }[] = [
    { label: 'Tugas Aktif', value: `${activeTasks.length} Tugas`, icon: ListTodo, page: 'tasks', hover: 'hover:border-[#052948]', iconCls: 'bg-[#052948]/10 text-[#052948]' },
    { label: 'Tugas Selesai', value: `${completedTasks.length} Tugas`, icon: CheckCircle2, page: 'tasks', hover: 'hover:border-[#4D687D]', iconCls: 'bg-[#4D687D]/15 text-[#4D687D]' },
    { label: 'Deadline Dekat', value: `${nearTasks.length} Mendesak`, icon: Flame, page: 'reminders', hover: 'hover:border-[#791A0A]', iconCls: 'bg-[#791A0A]/12 text-[#791A0A]' },
    { label: 'Topik Aktif', value: `${distinctTopics} Topik`, icon: Layers, page: 'schedule', hover: 'hover:border-[#052948]', iconCls: 'bg-[#B3B9BF]/30 text-[#052948]' },
  ];

  return (
    <>
      {/* Overdue banner */}
      {overdueTasks.length > 0 && (
        <div
          onClick={() => setPage('tasks')}
          className="cursor-pointer mb-4 px-4 py-3 rounded-2xl bg-red-600 text-white shadow-sm flex items-center justify-between gap-3 hover:bg-red-700 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-extrabold">Perhatian: {overdueTasks.length} Tugas Lewat Batas Waktu!</p>
              <p className="text-[11px] text-white/90">
                &quot;{overdueTasks[0].title}&quot; sudah melewati tenggat. Klik untuk perbarui sekarang.
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold underline shrink-0">Lihat →</span>
        </div>
      )}

      {/* Title + add button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#052948] tracking-tight leading-tight">
            Halo, {firstName}! 👋
          </h1>
          <p className="text-xs font-semibold text-[#4D687D] mt-0.5">
            {TODAY_LABEL} • {profile.studentClass}
          </p>
        </div>
        <button
          onClick={() => openModal('addStudyCardModal')}
          className="px-4 py-2.5 rounded-full bg-white hover:bg-[#052948] text-[#052948] hover:text-white border border-[#B3B9BF]/60 shadow-2xs text-xs font-extrabold flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Waktu Belajar</span>
        </button>
      </div>

      {/* Study cards */}
      <div className="schola-12-grid mb-5">
        {studyCards.length === 0 && (
          <div className="col-span-12 rounded-[22px] border border-dashed border-[#B3B9BF] bg-white p-6 text-center">
            <p className="text-sm font-bold text-[#4D687D]">
              Belum ada waktu belajar. Tambahkan kartu melalui tombol +.
            </p>
          </div>
        )}
        {studyCards.map((item) => {
          const pct = Math.min(100, Math.round((item.doneHours / item.goalHours) * 100));
          const st = getDynamicStyles(item.colorHex);
          const Icon = getStudyIcon(item.icon);
          return (
            <div
              key={item.id}
              onClick={() => selectStudyCard(item.id)}
              style={st.cardGradientStyle}
              className="col-span-12 sm:col-span-6 xl:col-span-4 cursor-pointer relative flex min-h-[180px] flex-col rounded-[26px] p-5 text-white overflow-hidden shadow-soft hover:-translate-y-1.5 hover:rotate-[0.5deg] hover:shadow-md transition-all group"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-9 h-24 w-24 rounded-full border border-white/15" />
              <div aria-hidden="true" className="pointer-events-none absolute right-8 top-12 h-8 w-8 rounded-full bg-white/8" />
              <div className="relative z-10 flex items-start justify-between gap-3">
                <h3 className="min-w-0 flex-1 break-words text-xl font-extrabold leading-tight tracking-tight">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quickAddStudyHours(item.id);
                    }}
                    title="Tambah +1 Jam Belajar"
                    className="px-2 py-1 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-xs text-[10px] font-extrabold text-white transition-colors"
                  >
                    +1 Jam
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openStudyCardEditor(item);
                    }}
                    aria-label={`Edit kartu ${item.title}`}
                    title="Edit Kartu"
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  {studyCards.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStudyCard(item.id);
                      }}
                      title="Hapus Kartu"
                      aria-label={`Hapus kartu ${item.title}`}
                      className="w-6 h-6 rounded-full bg-black/15 hover:bg-rose-500 text-white/85 hover:text-white flex items-center justify-center transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="relative z-10 mt-auto pt-6 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-extrabold leading-none">{pct}%</p>
                </div>
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <Icon
                    className={`shrink-0 text-white ${item.icon === 'calculator' ? 'h-6 w-6 scale-y-[1.1]' : 'h-6 w-6'}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {stats.map(({ label, value, icon: Icon, page, hover, iconCls }) => (
          <div
            key={label}
            onClick={() => setPage(page)}
            className={`col-span-1 cursor-pointer bg-white rounded-2xl px-3.5 py-3 border border-[#B3B9BF]/45 shadow-2xs ${hover} transition-all flex items-center gap-3`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconCls}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#4D687D]">{label}</p>
              <p className="text-sm font-extrabold text-[#052948]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's schedule */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#052948] tracking-tight">
            <span className="text-[#4D687D] font-bold">Today,</span> {TODAY_SHORT}
          </h2>
          <button
            onClick={() => setPage('schedule')}
            className="text-xs font-extrabold text-[#052948] hover:text-[#791A0A] transition-colors"
          >
            Atur Jam Jadwal →
          </button>
        </div>

        <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#B3B9BF]/45 shadow-2xs">
          <div className="schola-12-grid">
            {todayItems.length === 0 ? (
              <p className="text-xs text-slate-400 col-span-12">Belum ada jadwal pada hari {TODAY_DAY_NAME}.</p>
            ) : (
              todayItems.map((item) => {
                const st = getDynamicStyles(item.colorHex);
                return (
                  <div
                    key={item.id}
                    onClick={() => showToast(`${item.subject}: ${item.startTime} - ${item.endTime} (${item.room})`)}
                    style={st.blockStyle}
                    className="col-span-12 md:col-span-4 cursor-pointer p-3.5 rounded-2xl border hover:-translate-y-0.5 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span style={st.pillStyle} className="inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                        {item.startTime} – {item.endTime}
                      </span>
                      <p className="text-xs sm:text-sm font-extrabold truncate">{item.subject}</p>
                      <span className="text-[11px] font-bold opacity-75 block mt-0.5">📍 {item.room}</span>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-white/85 text-xs font-extrabold flex items-center justify-center shrink-0">
                      {item.subject.charAt(0).toUpperCase()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Nearest tasks */}
      <div className="bg-white rounded-[24px] p-5 border border-[#B3B9BF]/45 shadow-2xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#052948]" />
            <h3 className="text-sm font-extrabold text-[#052948]">Tugas Terdekat {firstName}</h3>
          </div>
          <button
            onClick={() => setPage('tasks')}
            className="text-xs font-extrabold text-[#052948] hover:text-[#791A0A] transition-colors"
          >
            Semua Tugas ({tasks.length}) →
          </button>
        </div>

        <div className="schola-12-grid">
          {tasks.slice(0, 4).map((t) => {
            const st = getDynamicStyles(t.colorHex);
            const dl = getDeadlineStatus(t.dueTimestamp, t.completed, now);
            const overdue = dl.isOverdue && !t.completed;
            return (
              <div
                key={t.id}
                className={`col-span-12 md:col-span-6 p-3 rounded-[20px] border hover:bg-white transition-all flex items-start gap-3 ${
                  overdue ? 'bg-red-50/90 border-red-300 ring-1 ring-red-200' : 'bg-slate-50/70 border-[#B3B9BF]/35'
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskDone(t.id);
                  }}
                  aria-label="Tandai selesai"
                  className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    t.completed
                      ? 'bg-[#052948] border-[#052948] text-white'
                      : dl.isOverdue
                        ? 'border-red-500 bg-white hover:bg-red-50'
                        : 'border-[#B3B9BF] bg-white hover:border-[#052948]'
                  }`}
                >
                  {t.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-extrabold truncate ${
                      t.completed ? 'line-through text-[#4D687D]' : dl.isOverdue ? 'text-red-900' : 'text-[#052948]'
                    }`}
                  >
                    {t.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span style={st.badgeStyle} className="text-[10px] font-extrabold px-2 py-0.5 rounded-md border">
                      {t.subject}
                    </span>
                    {t.customLabel && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#4D687D]/15 text-[#052948]">
                        {t.customLabel}
                      </span>
                    )}
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${dl.badgeClass}`}>
                      {dl.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
