'use client';

import { CornerDownRight, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePlanner } from '@/context/PlannerContext';
import { formatHours, getDynamicStyles, hoursToDurationParts } from '@/lib/utils';

const DEFAULT_TIMER_MINUTES = 25;
const DEFAULT_TIMER_SECONDS = DEFAULT_TIMER_MINUTES * 60;
const MAX_TIMER_HOURS = 99;
type Phase = 'idle' | 'focus' | 'paused' | 'done';

const PHASE_BADGE: Partial<Record<Phase, string>> = {
  focus: 'Fokus',
  paused: 'Dijeda',
  done: 'Selesai',
};
const PHASE_BUTTON: Record<Phase, string> = {
  idle: 'Mulai',
  focus: 'Jeda',
  paused: 'Lanjut',
  done: 'Mulai',
};

export default function FocusPanel() {
  const {
    firstName,
    isDummyAccount,
    focusHours,
    focusGoalHours,
    focusTopicIndex,
    studyCards,
    cycleFocusTopic,
    addFocusHours,
    logStudySession,
    openModal,
    showToast,
  } = usePlanner();

  const initialTimerSeconds = isDummyAccount ? DEFAULT_TIMER_SECONDS : 0;
  const [timerDurationSeconds, setTimerDurationSeconds] = useState(initialTimerSeconds);
  const [timerDurationInput, setTimerDurationInput] = useState(() =>
    hoursToDurationParts(initialTimerSeconds / 3600),
  );
  const [seconds, setSeconds] = useState(initialTimerSeconds);
  const [phase, setPhase] = useState<Phase>('idle');
  const activeCard = studyCards.length ? studyCards[focusTopicIndex % studyCards.length] : undefined;

  useEffect(() => {
    const durationSeconds = isDummyAccount ? DEFAULT_TIMER_SECONDS : 0;
    setTimerDurationSeconds(durationSeconds);
    setTimerDurationInput(hoursToDurationParts(durationSeconds / 3600));
    setSeconds(durationSeconds);
    setPhase('idle');
  }, [isDummyAccount]);

  const handleTimerDurationChange = (unit: 'hours' | 'minutes' | 'seconds', value: string) => {
    const nextInput = { ...timerDurationInput, [unit]: value };
    setTimerDurationInput(nextInput);

    const hours = Number(nextInput.hours) || 0;
    const minutes = Number(nextInput.minutes) || 0;
    const remainingSeconds = Number(nextInput.seconds) || 0;
    if (
      ![hours, minutes, remainingSeconds].every(Number.isInteger) ||
      hours < 0 ||
      hours > MAX_TIMER_HOURS ||
      minutes < 0 ||
      minutes > 59 ||
      remainingSeconds < 0 ||
      remainingSeconds > 59
    ) {
      return;
    }

    const durationSeconds = hours * 3600 + minutes * 60 + remainingSeconds;
    setTimerDurationSeconds(durationSeconds);
    if (phase !== 'focus') setSeconds(durationSeconds);
  };

  const restoreTimerDurationInput = () =>
    setTimerDurationInput(hoursToDurationParts(timerDurationSeconds / 3600));

  // Hitung mundur
  useEffect(() => {
    if (phase !== 'focus') return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Sesi selesai
  useEffect(() => {
    if (phase === 'focus' && seconds === 0) {
      setPhase('done');
      if (activeCard) {
        logStudySession(activeCard.id, timerDurationSeconds / 3600);
      } else {
        addFocusHours(timerDurationSeconds / 3600);
        showToast(`Sesi timer selesai! ${formatHours(timerDurationSeconds / 3600)} jam belajar dicatat.`);
      }
    }
  }, [phase, seconds, activeCard, timerDurationSeconds, logStudySession, addFocusHours, showToast]);

  const toggle = () => {
    if (phase === 'focus') {
      setPhase('paused');
    } else {
      if (timerDurationSeconds <= 0) {
        showToast('Atur durasi timer lebih dari 0 sebelum memulai.');
        return;
      }
      if (seconds === 0) setSeconds(timerDurationSeconds);
      setPhase('focus');
    }
  };

  const reset = () => {
    setPhase('idle');
    setSeconds(timerDurationSeconds);
  };

  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const timerDisplay = seconds >= 3600 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;

  const pct = Math.min(100, Math.round((focusHours / focusGoalHours) * 100));
  const activeColorGradient =
    getDynamicStyles(activeCard?.colorHex).cardGradientStyle.background ?? 'linear-gradient(135deg, #052948, #052948)';

  return (
    <aside
      className="flex min-h-[560px] w-full shrink-0 flex-col justify-between overflow-hidden p-6 text-white relative select-none sm:p-7 xl:min-h-0 xl:w-[348px] xl:overflow-y-auto"
      style={{
        backgroundImage: `linear-gradient(rgba(5, 41, 72, 0.42), rgba(5, 41, 72, 0.42)), ${activeColorGradient}`,
      }}
    >
      {/* Decorative shapes */}
      <div className="absolute -top-3 left-5 right-4 overflow-hidden whitespace-nowrap text-ellipsis text-right text-white/[0.06] text-[40px] font-extrabold leading-none pointer-events-none tracking-tighter">
        {activeCard?.subject ?? 'Fokus'}
      </div>
      <div className="absolute -bottom-14 -left-14 w-52 h-52 rounded-full bg-[#4D687D]/20 pointer-events-none" />
      <div className="absolute top-1/2 -right-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />

      {/* Top stats */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-bold text-white/95 mb-3">
          <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
          <span>Target Belajar Hari Ini</span>
        </div>

        <h2 className="text-[28px] font-extrabold leading-[1.15] tracking-tight">
          Fokus Belajar
          <br />
          {firstName}
        </h2>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-5xl font-extrabold tracking-tight">{formatHours(focusHours)}</span>
          <span className="text-sm font-semibold text-white/80">Jam Belajar</span>
        </div>

        {activeCard && (
          <p className="mt-2 text-xs font-medium text-white/85 flex items-center gap-1.5">
            <CornerDownRight className="w-3.5 h-3.5 text-white/75" />
            <span>Sesi: {activeCard.title}</span>
          </p>
        )}

        <div className="mt-4 bg-white/15 rounded-full h-2.5 w-full overflow-hidden">
          <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-[11px] font-semibold text-white/75 mt-1.5">
          <span>{pct}% tercapai</span>
          <span>Target: {formatHours(focusGoalHours)} Jam</span>
        </div>
      </div>

      {/* Timer */}
      <div className="relative z-10 my-4 bg-white/12 backdrop-blur-md border border-white/15 rounded-[24px] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Timer</span>
          <div className="flex items-center gap-1.5">
            {([
              ['hours', 'jam', 'j'],
              ['minutes', 'menit', 'm'],
              ['seconds', 'detik', 'd'],
            ] as const).map(([unit, accessibleUnit, shortLabel]) => (
              <label key={unit} className="flex items-center gap-0.5 text-[10px] font-semibold text-white/90">
                <span className="sr-only">{accessibleUnit} timer</span>
                <input
                  type="number"
                  min={0}
                  max={unit === 'hours' ? MAX_TIMER_HOURS : 59}
                  step={1}
                  value={timerDurationInput[unit]}
                  onChange={(event) => handleTimerDurationChange(unit, event.target.value)}
                  onBlur={restoreTimerDurationInput}
                  disabled={phase === 'focus'}
                  aria-label={`${accessibleUnit} timer`}
                  title={`Durasi timer: ${unit === 'hours' ? `0–${MAX_TIMER_HOURS} jam` : '0–59'}`}
                  className="w-8 rounded-lg bg-white/15 px-0.5 py-0.5 text-center text-[11px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-white/70 disabled:opacity-70"
                />
                <span>{shortLabel}</span>
              </label>
            ))}
            {PHASE_BADGE[phase] && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">{PHASE_BADGE[phase]}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-extrabold tracking-wider font-mono">
            {timerDisplay}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggle}
              className="px-3.5 py-2 rounded-full bg-[#791A0A] hover:bg-[#96220E] text-white text-xs font-extrabold shadow-sm transition-all"
            >
              {PHASE_BUTTON[phase]}
            </button>
            <button
              onClick={reset}
              title="Reset"
              aria-label="Reset timer"
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
          <span className="text-white/80 font-medium">Topik Aktif:</span>
          <button onClick={cycleFocusTopic} className="font-bold text-white hover:underline flex items-center gap-1">
            <span>{activeCard?.subject ?? '-'}</span>
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Bottom action */}
      <div className="relative z-10">
        <button
          onClick={() => openModal('studyDetailModal')}
          className="w-full py-3.5 rounded-full bg-white hover:bg-[#F7FAFC] text-[#052948] font-extrabold text-sm shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#791A0A]" />
          <span>Detail & Catat Waktu Belajar</span>
        </button>
      </div>
    </aside>
  );
}
