'use client';

import { Plus, X } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { DAYS, SEMESTERS, TODAY_DAY_NAME } from '@/lib/constants';
import { getDynamicStyles } from '@/lib/utils';

export default function SchedulePage() {
  const { schedule, selectedSemester, changeSemester, openModal, openScheduleForDay, removeSchedule } = usePlanner();
  const entries = schedule[selectedSemester] ?? [];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#052948] tracking-tight">Jadwal Pelajaran</h1>
          <p className="text-xs font-semibold text-[#4D687D] mt-0.5">
            Atur jam mulai dan jam selesai secara bebas sesuai kebutuhan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedSemester}
            onChange={(e) => changeSemester(e.target.value)}
            className="px-4 py-2.5 rounded-full bg-white border border-[#B3B9BF]/60 text-xs font-extrabold text-[#052948] shadow-2xs focus:border-[#052948] focus:outline-none"
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
          <button
            onClick={() => openModal('addScheduleModal')}
            className="px-4 py-2.5 rounded-full bg-[#052948] hover:bg-[#4D687D] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Jadwal</span>
          </button>
        </div>
      </div>

      <div className="schola-12-grid">
        {DAYS.map((dayName) => {
          const dayEntries = entries
            .filter((e) => e.day === dayName)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          const isToday = dayName === TODAY_DAY_NAME;

          return (
            <div
              key={dayName}
              className={`col-span-12 sm:col-span-6 xl:col-span-4 bg-white rounded-[24px] p-4 border shadow-2xs flex flex-col justify-between ${
                isToday ? 'border-[#052948] ring-2 ring-[#052948]/15' : 'border-[#B3B9BF]/45'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#B3B9BF]/30">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isToday ? 'bg-[#052948]' : 'bg-[#B3B9BF]'}`} />
                    <h3 className={`text-sm font-extrabold ${isToday ? 'text-[#052948]' : 'text-[#4D687D]'}`}>{dayName}</h3>
                    {isToday && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#052948]/10 text-[#052948]">
                        Hari Ini
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => openScheduleForDay(dayName)}
                    title={`Tambah jadwal hari ${dayName}`}
                    aria-label={`Tambah jadwal hari ${dayName}`}
                    className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-[#052948]/10 text-[#4D687D] hover:text-[#052948] flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {dayEntries.length === 0 ? (
                    <p className="text-[11px] font-semibold text-[#4D687D]/70 py-4 text-center">
                      Belum ada jadwal di hari {dayName}
                    </p>
                  ) : (
                    dayEntries.map((item) => {
                      const st = getDynamicStyles(item.colorHex);
                      return (
                        <div key={item.id} style={st.blockStyle} className="p-3 rounded-2xl border relative group">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span style={st.pillStyle} className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                              {item.startTime} – {item.endTime}
                            </span>
                            <button
                              onClick={() => removeSchedule(item.id)}
                              title="Hapus Jadwal"
                              aria-label="Hapus Jadwal"
                              className="w-5 h-5 rounded-full bg-white/80 hover:bg-[#791A0A] text-[#4D687D] hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs sm:text-sm font-extrabold">{item.subject}</p>
                          <p className="text-[11px] font-semibold opacity-75 mt-0.5">📍 {item.room}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
