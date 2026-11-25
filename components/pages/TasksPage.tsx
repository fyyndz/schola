'use client';

import { Check, ChevronDown, History, Plus, Trash2 } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import type { RetentionUnit, TaskFilter } from '@/lib/types';
import { getDeadlineStatus, getDynamicStyles, sortTasksByDeadline } from '@/lib/utils';

export default function TasksPage() {
  const {
    tasks,
    taskFilter,
    setTaskFilter,
    search,
    now,
    retention,
    updateRetention,
    clearCompleted,
    openModal,
    toggleTaskDone,
    extendTask,
    deleteTask,
  } = usePlanner();

  const query = search.trim().toLowerCase();
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.length - pendingCount;

  const filtered = sortTasksByDeadline(tasks
    .filter((task) => {
      if (taskFilter === 'pending') return !task.completed;
      if (taskFilter === 'completed') return task.completed;
      return true;
    })
    .filter(
      (task) =>
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.subject.toLowerCase().includes(query) ||
        (task.customLabel && task.customLabel.toLowerCase().includes(query)),
    ));

  const filters: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: `Semua (${tasks.length})` },
    { key: 'pending', label: `Belum Selesai (${pendingCount})` },
    { key: 'completed', label: `Selesai (${completedCount})` },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#052948] tracking-tight">Manajemen Tugas</h1>
          <p className="text-xs font-semibold text-[#4D687D] mt-0.5">
            Pantau hitung mundur tenggat waktu dan bersihkan riwayat tugas selesai otomatis
          </p>
        </div>
        <button
          onClick={() => openModal('addTaskModal')}
          className="px-4 py-2.5 rounded-full bg-[#052948] hover:bg-[#4D687D] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tugas</span>
        </button>
      </div>

      {/* Filter pills + auto-cleanup control */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setTaskFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                taskFilter === f.key
                  ? 'bg-[#052948] text-white shadow-xs'
                  : 'bg-white text-[#4D687D] border border-[#B3B9BF]/50 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#B3B9BF]/50 shadow-2xs text-xs">
          <History className="w-3.5 h-3.5 text-[#4D687D]" />
          <span className="font-bold text-[#4D687D]">Hapus riwayat selesai setelah:</span>
          <input
            type="number"
            min={1}
            max={365}
            value={retention.value}
            onChange={(e) => updateRetention(parseInt(e.target.value, 10) || 1, null)}
            className="w-12 px-2 py-0.5 rounded-lg border border-[#B3B9BF] text-center font-extrabold text-[#052948]"
          />
          <div className="relative inline-flex items-center">
            <select
              value={retention.unit}
              onChange={(e) => updateRetention(null, e.target.value as RetentionUnit)}
              className="appearance-none font-extrabold text-[#052948] bg-slate-50 hover:bg-slate-100 pl-2.5 pr-7 py-1 rounded-lg border border-[#B3B9BF]/60 focus:border-[#052948] focus:outline-none cursor-pointer"
            >
              <option value="hours">Jam</option>
              <option value="days">Hari</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#4D687D] pointer-events-none absolute right-2" />
          </div>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="ml-1 px-2.5 py-1 rounded-full bg-[#791A0A]/10 hover:bg-[#791A0A]/20 text-[#791A0A] text-[11px] font-extrabold transition-colors"
            >
              Bersihkan Sekarang
            </button>
          )}
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-[24px] p-10 text-center border border-[#B3B9BF]/45">
            <p className="text-sm font-extrabold text-[#4D687D]">Tidak ada tugas pada filter ini.</p>
          </div>
        ) : (
          filtered.map((task) => {
            const st = getDynamicStyles(task.colorHex);
            const dl = getDeadlineStatus(task.dueTimestamp, task.completed, now);
            const overdue = dl.isOverdue && !task.completed;
            const prioClass =
              task.priority === 'Tinggi'
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-[#4D687D]/15 text-[#052948] border-[#4D687D]/30';

            return (
              <div
                key={task.id}
                className={`rounded-[22px] p-4 border shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-white opacity-70 border-[#B3B9BF]/40'
                    : overdue
                      ? 'bg-red-50/90 border-red-300 ring-1 ring-red-200 hover:border-red-500'
                      : 'bg-white border-[#B3B9BF]/45 hover:border-[#052948]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskDone(task.id);
                    }}
                    aria-label="Tandai selesai"
                    className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all ${
                      task.completed
                        ? 'bg-[#052948] border-[#052948] text-white'
                        : dl.isOverdue
                          ? 'border-red-500 bg-white hover:bg-red-50'
                          : 'border-[#B3B9BF] bg-white hover:border-[#052948]'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-extrabold ${
                          task.completed ? 'line-through text-[#4D687D]' : dl.isOverdue ? 'text-red-900' : 'text-[#052948]'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {overdue && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-600 text-white">
                          Tenggat lewat
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span style={st.badgeStyle} className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border">
                        {task.subject}
                      </span>
                      {task.customLabel && (
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#4D687D]/15 text-[#052948]">
                          {task.customLabel}
                        </span>
                      )}
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${dl.badgeClass}`}>
                        ⏳ {dl.text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 pl-9 sm:pl-0">
                  {overdue && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        extendTask(task.id);
                      }}
                      className="px-2.5 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-extrabold shadow-xs transition-colors"
                    >
                      +24 Jam
                    </button>
                  )}
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${prioClass}`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    aria-label="Hapus tugas"
                    className="p-2 rounded-xl text-[#4D687D] hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
