'use client';

import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import { CALENDAR_DAY_HEADERS, TODAY_ISO_DATE } from '@/lib/constants';
import { getDynamicStyles } from '@/lib/utils';

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function CalendarPage() {
  const { calendarEvents, selectedCalDay, selectCalDay, openAgendaForDay } = usePlanner();
  const selectedDate = new Date(`${selectedCalDay}T00:00:00`);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const monthTitle = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(selectedDate);
  const selectedDateTitle = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(selectedDate);
  const selectedAgendas = calendarEvents[selectedCalDay] ?? [];
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const changeMonth = (offset: number) => {
    const targetMonth = new Date(year, month + offset, 1);
    const lastDay = new Date(year, month + offset + 1, 0).getDate();
    targetMonth.setDate(Math.min(selectedDate.getDate(), lastDay));
    selectCalDay(toDateKey(targetMonth));
  };

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-[#052948] tracking-tight">Kalender Akademik</h1>
        <p className="text-xs font-semibold text-[#4D687D] mt-0.5">
          Jadwal ulangan, rapat OSIS, praktikum, dan kegiatan akademik
        </p>
      </div>

      <div className="schola-12-grid">
        <div className="col-span-12 xl:col-span-7 bg-white rounded-[24px] p-5 border border-[#B3B9BF]/45 shadow-2xs">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h3 className="text-base font-extrabold text-[#052948] flex items-center gap-2 capitalize">
              <span className="w-8 h-8 rounded-xl bg-[#052948]/10 text-[#052948] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </span>
              <span>{monthTitle}</span>
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Bulan sebelumnya"
                title="Bulan sebelumnya"
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-[#052948] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => selectCalDay(TODAY_ISO_DATE)}
                className="px-3 py-1 rounded-full bg-[#052948]/10 text-[#052948] text-[11px] font-extrabold hover:bg-[#052948]/20"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Bulan berikutnya"
                title="Bulan berikutnya"
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-[#052948] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
            {CALENDAR_DAY_HEADERS.map((dayHeader) => (
              <span key={dayHeader} className="text-[11px] font-extrabold text-[#4D687D] py-1">
                {dayHeader}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, index) => {
              if (day === null) return <span key={`empty-${index}`} aria-hidden="true" className="h-12" />;

              const dateKey = toDateKey(new Date(year, month, day));
              const events = calendarEvents[dateKey];
              const hasEvents = !!events && events.length > 0;
              const isSelected = dateKey === selectedCalDay;
              const isToday = dateKey === TODAY_ISO_DATE;

              return (
                <button
                  type="button"
                  key={dateKey}
                  onClick={() => selectCalDay(dateKey)}
                  aria-pressed={isSelected}
                  aria-label={`${day} ${monthTitle}${hasEvents ? `, ${events.length} agenda` : ''}`}
                  className={`h-12 rounded-2xl flex flex-col items-center justify-center relative transition-all ${
                    isSelected
                      ? 'bg-[#052948] text-white font-extrabold shadow-md'
                      : isToday
                        ? 'bg-[#052948]/10 text-[#052948] font-extrabold border border-[#052948]/30'
                        : 'hover:bg-slate-100 text-[#052948] font-semibold'
                  }`}
                >
                  <span className="text-xs">{day}</span>
                  {hasEvents && (
                    <span
                      style={{ backgroundColor: isSelected ? '#ffffff' : events[0].colorHex }}
                      className="w-1.5 h-1.5 rounded-full mt-1"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 bg-white rounded-[24px] p-5 border border-[#B3B9BF]/45 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#B3B9BF]/30">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4D687D]">
                  Agenda Tanggal
                </span>
                <h3 className="text-base font-extrabold text-[#052948]">{selectedDateTitle}</h3>
              </div>
              <button
                onClick={() => openAgendaForDay(selectedCalDay)}
                className="px-3 py-1.5 rounded-full bg-[#052948] hover:bg-[#4D687D] text-white text-xs font-extrabold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {selectedAgendas.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-xs font-bold text-[#4D687D]">Tidak ada kegiatan khusus pada tanggal ini.</p>
                </div>
              ) : (
                selectedAgendas.map((event, index) => {
                  const styles = getDynamicStyles(event.colorHex);
                  return (
                    <div key={`${event.title}-${index}`} style={styles.blockStyle} className="p-3.5 rounded-2xl border">
                      <span style={styles.badgeStyle} className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border">
                        {event.type}
                      </span>
                      <h4 className="text-sm font-extrabold mt-1.5">{event.title}</h4>
                      <p className="text-xs font-semibold opacity-80 mt-0.5">⏰ {event.time}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
