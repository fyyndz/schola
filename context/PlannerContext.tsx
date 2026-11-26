'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { HOUR_MS, NEW_CARD_ICONS, SEMESTERS, TODAY_ISO_DATE } from '@/lib/constants';
import {
  changeDemoAccountEmail,
  demoCredentials,
  getCurrentDemoUser,
  logoutDemoAccount,
} from '@/lib/demo-auth';
import { playClickSound, playSuccessSound } from '@/lib/sound';
import {
  createInitialTasks,
  initialCalendarEvents,
  initialProfile,
  initialReminders,
  initialSchedule,
  initialStudyCards,
} from '@/lib/data';
import {
  readPlannerSnapshot,
  removeDemoSeedData,
  movePlannerSnapshot,
  writePlannerSnapshot,
} from '@/lib/planner-storage';
import type {
  CalendarEvent,
  CalendarEvents,
  DayName,
  ModalId,
  NewTaskInput,
  PageKey,
  ProfileSwitchKey,
  Reminder,
  ReminderInput,
  RetentionUnit,
  ScheduleItem,
  StudentProfile,
  StudyCard,
  Task,
  TaskFilter,
} from '@/lib/types';
import { formatHours, pruneTasks } from '@/lib/utils';

interface ModalState {
  id: ModalId | null;
  scheduleDay: DayName;
  agendaDay: string;
  reminderToEdit: Reminder | null;
  studyCardToEdit: StudyCard | null;
}

interface PlannerContextValue {
  // navigation & ui
  page: PageKey;
  setPage: (page: PageKey) => void;
  mobileNavOpen: boolean;
  toggleMobileNav: () => void;
  modal: ModalState;
  openModal: (id: ModalId) => void;
  openReminderEditor: (reminder: Reminder) => void;
  openStudyCardEditor: (card: StudyCard) => void;
  openScheduleForDay: (day: DayName) => void;
  openAgendaForDay: (day: string) => void;
  openQuickAction: () => void;
  closeModal: () => void;
  toast: { message: string; visible: boolean };
  showToast: (message: string) => void;
  now: number;

  // search & filters
  search: string;
  setSearch: (value: string) => void;
  taskFilter: TaskFilter;
  setTaskFilter: (filter: TaskFilter) => void;

  // profile
  profile: StudentProfile;
  firstName: string;
  isDummyAccount: boolean;
  updateProfile: (
    data: Pick<StudentProfile, 'name' | 'studentClass' | 'school' | 'email' | 'avatarDataUrl'>,
  ) => void;
  toggleProfileSwitch: (key: ProfileSwitchKey) => void;
  confirmLogout: () => void;

  // focus & study cards
  studyCards: StudyCard[];
  focusHours: number;
  focusGoalHours: number;
  focusTopicIndex: number;
  addFocusHours: (hours: number) => void;
  cycleFocusTopic: () => void;
  selectStudyCard: (id: string) => void;
  quickAddStudyHours: (id: string) => void;
  removeStudyCard: (id: string) => void;
  addStudyCard: (input: Omit<StudyCard, 'id' | 'icon'>) => void;
  updateStudyCard: (id: string, input: Omit<StudyCard, 'id' | 'icon'>) => void;
  logStudySession: (cardId: string, hours: number) => void;

  // tasks
  tasks: Task[];
  retention: { value: number; unit: RetentionUnit };
  updateRetention: (value: number | null, unit: RetentionUnit | null) => void;
  clearCompleted: () => void;
  addTask: (input: NewTaskInput) => void;
  toggleTaskDone: (id: number) => void;
  extendTask: (id: number) => void;
  deleteTask: (id: number) => void;

  // schedule
  schedule: Record<string, ScheduleItem[]>;
  selectedSemester: string;
  changeSemester: (semester: string) => void;
  addSchedule: (item: Omit<ScheduleItem, 'id'>) => void;
  removeSchedule: (id: string) => void;

  // calendar
  calendarEvents: CalendarEvents;
  selectedCalDay: string;
  selectCalDay: (day: string) => void;
  addAgenda: (day: string, event: CalendarEvent) => void;

  // reminders
  reminders: Reminder[];
  addReminder: (input: ReminderInput) => void;
  updateReminder: (id: number, input: ReminderInput) => void;
  deleteReminder: (id: number) => void;
  toggleReminder: (id: number) => void;

  // derived
  activeTasksCount: number;
  overdueCount: number;
  activeRemindersCount: number;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function usePlanner(): PlannerContextValue {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner harus dipakai di dalam <PlannerProvider>');
  return ctx;
}

export function PlannerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const [page, setPageState] = useState<PageKey>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    id: null,
    scheduleDay: 'Senin',
    agendaDay: TODAY_ISO_DATE,
    reminderToEdit: null,
    studyCardToEdit: null,
  });
  const [toast, setToast] = useState({ message: '', visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [search, setSearch] = useState('');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [plannerAccountEmail, setPlannerAccountEmail] = useState<string | null>(null);
  const [isDummyAccount, setIsDummyAccount] = useState(false);
  const [plannerDataReady, setPlannerDataReady] = useState(false);
  const [plannerPersistenceEnabled, setPlannerPersistenceEnabled] = useState(true);

  const [studyCards, setStudyCards] = useState<StudyCard[]>(initialStudyCards);
  const [focusHours, setFocusHours] = useState(3.5);
  const focusGoalHours = 5.0;
  const [focusTopicIndex, setFocusTopicIndex] = useState(0);

  const [retention, setRetention] = useState<{ value: number; unit: RetentionUnit }>({ value: 24, unit: 'hours' });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const t = Date.now();
    return pruneTasks(createInitialTasks(t), false, 24, 'hours', t);
  });

  const [schedule, setSchedule] = useState<Record<string, ScheduleItem[]>>(initialSchedule);
  const [selectedSemester, setSelectedSemester] = useState<string>(SEMESTERS[0]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvents>(initialCalendarEvents);
  const [selectedCalDay, setSelectedCalDay] = useState(TODAY_ISO_DATE);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  // Segarkan hitung mundur tiap menit
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2600);
  }, []);

  useEffect(() => {
    try {
      const user = getCurrentDemoUser();
      if (user) {
        const userProfile = {
          name: user.name,
          email: user.email,
          studentClass: user.studentClass,
          school: user.school,
        };
        setPlannerAccountEmail(user.email);
        setProfile((current) => ({ ...current, ...userProfile }));
        const isDummyAccountUser =
          user.isDemo || user.email.toLowerCase() === demoCredentials.email.toLowerCase();
        setIsDummyAccount(isDummyAccountUser);
        const saved = readPlannerSnapshot(user.email);
        if (saved) {
          const accountSnapshot = isDummyAccountUser ? saved : removeDemoSeedData(saved);
          const savedProfile =
            isDummyAccountUser && (accountSnapshot.profile.name === 'Leviona Putri' || accountSnapshot.profile.name === 'Leviona')
              ? { ...accountSnapshot.profile, name: demoCredentials.name }
              : accountSnapshot.profile;
          setProfile(savedProfile);
          setStudyCards(accountSnapshot.studyCards);
          setFocusHours(accountSnapshot.focusHours);
          setFocusTopicIndex(accountSnapshot.focusTopicIndex);
          setRetention(accountSnapshot.retention);
          setTasks(accountSnapshot.tasks);
          setSchedule(accountSnapshot.schedule);
          setSelectedSemester(accountSnapshot.selectedSemester);
          setCalendarEvents(accountSnapshot.calendarEvents);
          setSelectedCalDay(accountSnapshot.selectedCalDay);
          setReminders(accountSnapshot.reminders);
        } else if (!isDummyAccountUser) {
          setProfile({ ...initialProfile, ...userProfile, nis: '', avatarDataUrl: undefined });
          setStudyCards([]);
          setFocusHours(0);
          setFocusTopicIndex(0);
          setRetention({ value: 24, unit: 'hours' });
          setTasks([]);
          setSchedule({});
          setSelectedSemester(SEMESTERS[0]);
          setCalendarEvents({});
          setSelectedCalDay(TODAY_ISO_DATE);
          setReminders([]);
        } else {
          setProfile((current) => ({ ...current, ...user }));
        }
      }
    } catch (error) {
      setPlannerPersistenceEnabled(false);
      showToast(error instanceof Error ? error.message : 'Sesi tidak dapat dibaca.');
    } finally {
      setPlannerDataReady(true);
    }
  }, [showToast]);

  useEffect(() => {
    if (!plannerDataReady || !plannerPersistenceEnabled || !plannerAccountEmail) return;

    try {
      writePlannerSnapshot(plannerAccountEmail, {
        profile,
        studyCards,
        focusHours,
        focusTopicIndex,
        retention,
        tasks,
        schedule,
        selectedSemester,
        calendarEvents,
        selectedCalDay,
        reminders,
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Data planner tidak dapat disimpan.');
    }
  }, [
    calendarEvents,
    focusHours,
    focusTopicIndex,
    plannerAccountEmail,
    plannerDataReady,
    plannerPersistenceEnabled,
    profile,
    reminders,
    retention,
    schedule,
    selectedCalDay,
    selectedSemester,
    showToast,
    studyCards,
    tasks,
  ]);

  // ---------- navigation ----------
  const setPage = useCallback(
    (p: PageKey) => {
    playClickSound(profile.soundEffectsEnabled);
      const t = Date.now();
      setNow(t);
      setTasks((prev) => pruneTasks(prev, false, retention.value, retention.unit, t));
      setPageState(p);
      setMobileNavOpen(false);
    },
    [profile.soundEffectsEnabled, retention],
  );

  const toggleMobileNav = useCallback(() => {
    playClickSound(profile.soundEffectsEnabled);
    setMobileNavOpen((open) => !open);
  }, [profile.soundEffectsEnabled]);

  // ---------- modals ----------
  const openModal = useCallback((id: ModalId) => {
    playClickSound(profile.soundEffectsEnabled);
    setModal({ id, scheduleDay: 'Senin', agendaDay: TODAY_ISO_DATE, reminderToEdit: null, studyCardToEdit: null });
  }, [profile.soundEffectsEnabled]);
  const openReminderEditor = useCallback((reminder: Reminder) => {
    playClickSound(profile.soundEffectsEnabled);
    setModal({
      id: 'addReminderModal',
      scheduleDay: 'Senin',
      agendaDay: TODAY_ISO_DATE,
      reminderToEdit: reminder,
      studyCardToEdit: null,
    });
  }, [profile.soundEffectsEnabled]);
  const openStudyCardEditor = useCallback((card: StudyCard) => {
    playClickSound(profile.soundEffectsEnabled);
    setModal({
      id: 'addStudyCardModal',
      scheduleDay: 'Senin',
      agendaDay: TODAY_ISO_DATE,
      reminderToEdit: null,
      studyCardToEdit: card,
    });
  }, [profile.soundEffectsEnabled]);
  const openScheduleForDay = useCallback((day: DayName) => {
    setModal({
      id: 'addScheduleModal',
      scheduleDay: day,
      agendaDay: TODAY_ISO_DATE,
      reminderToEdit: null,
      studyCardToEdit: null,
    });
  }, []);
  const openAgendaForDay = useCallback((day: string) => {
    setModal({
      id: 'addAgendaModal',
      scheduleDay: 'Senin',
      agendaDay: day,
      reminderToEdit: null,
      studyCardToEdit: null,
    });
  }, []);
  const closeModal = useCallback(() => setModal((m) => ({ ...m, id: null })), []);

  const openQuickAction = useCallback(() => {
    const map: Record<PageKey, ModalId> = {
      dashboard: 'addStudyCardModal',
      tasks: 'addTaskModal',
      schedule: 'addScheduleModal',
      calendar: 'addAgendaModal',
      reminders: 'addReminderModal',
      profile: 'editProfileModal',
    };
    openModal(map[page]);
  }, [page, openModal]);

  // ---------- profile ----------
  const firstName = profile.name.split(' ')[0];

  const updateProfile = useCallback(
    (data: Pick<StudentProfile, 'name' | 'studentClass' | 'school' | 'email' | 'avatarDataUrl'>) => {
      let updatedData = data;
      if (plannerAccountEmail && data.email.trim().toLowerCase() !== plannerAccountEmail) {
        const nextEmail = changeDemoAccountEmail(plannerAccountEmail, data.email);
        let migrationError: string | null = null;
        try {
          movePlannerSnapshot(plannerAccountEmail, nextEmail);
        } catch (error) {
          migrationError = error instanceof Error ? error.message : 'Data planner gagal dipindahkan.';
        }
        setPlannerAccountEmail(nextEmail);
        updatedData = { ...data, email: nextEmail };
        setProfile((profile) => ({ ...profile, ...updatedData }));
        showToast(migrationError ?? `Profile diperbarui! Kelas: ${data.studentClass}`);
        return;
      }

      setProfile((profile) => ({ ...profile, ...updatedData }));
      showToast(`Profile diperbarui! Kelas: ${data.studentClass}`);
    },
    [plannerAccountEmail, showToast],
  );

  const toggleProfileSwitch = useCallback(
    (key: ProfileSwitchKey) => {
      setProfile((p) => ({ ...p, [key]: !p[key] }));
      showToast(key === 'soundEffectsEnabled' ? 'Pengaturan efek suara diperbarui.' : 'Pengaturan notifikasi diperbarui.');
    },
    [showToast],
  );

  const confirmLogout = useCallback(() => {
    setModal((m) => ({ ...m, id: null }));
    try {
      logoutDemoAccount();
      router.replace('/login');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal keluar dari akun.');
    }
  }, [router, showToast]);

  // ---------- focus & study cards ----------
  const addFocusHours = useCallback((hours: number) => {
    setFocusHours((h) => +(h + hours).toFixed(2));
  }, []);

  const cycleFocusTopic = useCallback(() => {
    if (studyCards.length === 0) return;
    setFocusTopicIndex((i) => (i + 1) % studyCards.length);
  }, [studyCards.length]);

  const selectStudyCard = useCallback(
    (id: string) => {
      const idx = studyCards.findIndex((c) => c.id === id);
      if (idx === -1) return;
      setFocusTopicIndex(idx);
      showToast(`Sesi fokus aktif: ${studyCards[idx].title}`);
    },
    [studyCards, showToast],
  );

  const quickAddStudyHours = useCallback(
    (id: string) => {
      const cardIndex = studyCards.findIndex((c) => c.id === id);
      if (cardIndex === -1) return;
      const card = studyCards[cardIndex];
      setFocusTopicIndex(cardIndex);
      setStudyCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, doneHours: Math.min(c.goalHours, +(c.doneHours + 1).toFixed(2)) } : c)),
      );
      addFocusHours(1);
      playSuccessSound(profile.soundEffectsEnabled);
      showToast(`+1 Jam ditambahkan ke ${card.title}!`);
    },
    [studyCards, addFocusHours, profile.soundEffectsEnabled, showToast],
  );

  const removeStudyCard = useCallback(
    (id: string) => {
      if (studyCards.length <= 1) return;
      setStudyCards((prev) => prev.filter((c) => c.id !== id));
      setFocusTopicIndex(0);
      showToast('Kartu waktu belajar dihapus.');
    },
    [studyCards.length, showToast],
  );

  const addStudyCard = useCallback(
    (input: Omit<StudyCard, 'id' | 'icon'>) => {
      setFocusTopicIndex(studyCards.length);
      setStudyCards((prev) => [
        ...prev,
        { ...input, id: 'sc-' + Date.now(), icon: NEW_CARD_ICONS[prev.length % NEW_CARD_ICONS.length] },
      ]);
      showToast(`Kartu "${input.title}" ditambahkan!`);
    },
    [studyCards.length, showToast],
  );

  const updateStudyCard = useCallback(
    (id: string, input: Omit<StudyCard, 'id' | 'icon'>) => {
      setStudyCards((prev) => prev.map((card) => (card.id === id ? { ...card, ...input } : card)));
      showToast(`Kartu "${input.title}" diperbarui.`);
    },
    [showToast],
  );

  const logStudySession = useCallback(
    (cardId: string, hours: number) => {
      const cardIndex = studyCards.findIndex((card) => card.id === cardId);
      if (cardIndex !== -1) setFocusTopicIndex(cardIndex);
      setStudyCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, doneHours: Math.min(c.goalHours, +(c.doneHours + hours).toFixed(2)) } : c)),
      );
      addFocusHours(hours);
      showToast(`+${formatHours(hours)} jam belajar berhasil dicatat!`);
    },
    [studyCards, addFocusHours, showToast],
  );

  // ---------- tasks ----------
  const updateRetention = useCallback(
    (value: number | null, unit: RetentionUnit | null) => {
      const next = {
        value: value !== null ? Math.max(1, Math.floor(value) || 1) : retention.value,
        unit: unit !== null ? unit : retention.unit,
      };
      setRetention(next);
      setTasks((prev) => pruneTasks(prev, false, next.value, next.unit, Date.now()));
      showToast(`Riwayat tugas selesai akan dihapus otomatis setelah ${next.value} ${next.unit === 'days' ? 'hari' : 'jam'}.`);
    },
    [retention, showToast],
  );

  const clearCompleted = useCallback(() => {
    const removed = tasks.filter((t) => t.completed).length;
    setTasks((prev) => prev.filter((t) => !t.completed));
    showToast(removed > 0 ? `${removed} riwayat tugas selesai dibersihkan!` : 'Tidak ada riwayat tugas selesai.');
  }, [tasks, showToast]);

  const addTask = useCallback(
    (input: NewTaskInput) => {
      const t = Date.now();
      let due = t + 24 * HOUR_MS;
      switch (input.preset) {
        case 'hours_3':
          due = t + 3 * HOUR_MS;
          break;
        case 'tomorrow':
          due = t + 24 * HOUR_MS;
          break;
        case 'days_2':
          due = t + 48 * HOUR_MS;
          break;
        case 'days_4':
          due = t + 96 * HOUR_MS;
          break;
        case 'overdue_test':
          due = t - 2 * HOUR_MS;
          break;
        case 'custom':
          if (input.customDatetime) due = new Date(input.customDatetime).getTime();
          break;
      }
      setNow(t);
      setTasks((prev) => [
        {
          id: t,
          title: input.title,
          subject: input.subject,
          colorHex: input.colorHex,
          customLabel: input.customLabel,
          priority: input.priority,
          completed: false,
          completedAt: null,
          dueTimestamp: due,
        },
        ...prev,
      ]);
      showToast('Tugas baru berhasil ditambahkan!');
    },
    [showToast],
  );

  const toggleTaskDone = useCallback(
    (id: number) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const completed = !task.completed;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed, completedAt: completed ? Date.now() : null } : t)),
      );
      if (completed) playSuccessSound(profile.soundEffectsEnabled);
      else playClickSound(profile.soundEffectsEnabled);
      showToast(completed ? 'Tugas selesai! Masuk riwayat sementara.' : 'Tugas dibuka kembali.');
    },
    [tasks, profile.soundEffectsEnabled, showToast],
  );

  const extendTask = useCallback(
    (id: number) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const t = Date.now();
      setNow(t);
      setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, dueTimestamp: t + 24 * HOUR_MS } : x)));
      showToast(`Tenggat "${task.title}" diperpanjang +24 jam!`);
    },
    [tasks, showToast],
  );

  const deleteTask = useCallback(
    (id: number) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Tugas dihapus.');
    },
    [showToast],
  );

  // ---------- schedule ----------
  const changeSemester = useCallback((semester: string) => setSelectedSemester(semester), []);

  const addSchedule = useCallback(
    (item: Omit<ScheduleItem, 'id'>) => {
      setSchedule((prev) => ({
        ...prev,
        [selectedSemester]: [...(prev[selectedSemester] ?? []), { ...item, id: 'sch-' + Date.now() }],
      }));
      showToast(`Jadwal ${item.subject} (${item.startTime}–${item.endTime}) ditambahkan!`);
    },
    [selectedSemester, showToast],
  );

  const removeSchedule = useCallback(
    (id: string) => {
      setSchedule((prev) => ({
        ...prev,
        [selectedSemester]: (prev[selectedSemester] ?? []).filter((s) => s.id !== id),
      }));
      showToast('Slot jadwal dihapus.');
    },
    [selectedSemester, showToast],
  );

  // ---------- calendar ----------
  const selectCalDay = useCallback((day: string) => setSelectedCalDay(day), []);

  const addAgenda = useCallback(
    (day: string, event: CalendarEvent) => {
      setCalendarEvents((prev) => ({ ...prev, [day]: [...(prev[day] ?? []), event] }));
      setSelectedCalDay(day);
      showToast(`Agenda "${event.title}" ditambahkan!`);
    },
    [showToast],
  );

  // ---------- reminders ----------
  const addReminder = useCallback(
    (input: ReminderInput) => {
      setReminders((prev) => [
        { ...input, id: Date.now(), done: false },
        ...prev,
      ]);
      showToast('Pengingat baru berhasil disimpan!');
    },
    [showToast],
  );

  const updateReminder = useCallback(
    (id: number, input: ReminderInput) => {
      setReminders((prev) => prev.map((reminder) => (reminder.id === id ? { ...reminder, ...input } : reminder)));
      showToast('Pengingat berhasil diperbarui.');
    },
    [showToast],
  );

  const deleteReminder = useCallback(
    (id: number) => {
      setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
      showToast('Pengingat dihapus.');
    },
    [showToast],
  );

  const toggleReminder = useCallback(
    (id: number) => {
      const rem = reminders.find((r) => r.id === id);
      if (!rem) return;
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
      showToast(!rem.done ? 'Pengingat ditandai selesai.' : 'Pengingat diaktifkan.');
    },
    [reminders, showToast],
  );

  // ---------- derived ----------
  const activeTasksCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const overdueCount = useMemo(
    () => tasks.filter((t) => !t.completed && t.dueTimestamp <= now).length,
    [tasks, now],
  );
  const activeRemindersCount = useMemo(
    () => reminders.filter((r) => !r.done).length + overdueCount,
    [reminders, overdueCount],
  );

  const value: PlannerContextValue = {
    page, setPage, mobileNavOpen, toggleMobileNav,
    modal, openModal, openReminderEditor, openStudyCardEditor, openScheduleForDay, openAgendaForDay, openQuickAction, closeModal,
    toast, showToast, now,
    search, setSearch, taskFilter, setTaskFilter,
    profile, firstName, isDummyAccount, updateProfile, toggleProfileSwitch, confirmLogout,
    studyCards, focusHours, focusGoalHours, focusTopicIndex,
    addFocusHours, cycleFocusTopic, selectStudyCard, quickAddStudyHours, removeStudyCard, addStudyCard, updateStudyCard, logStudySession,
    tasks, retention, updateRetention, clearCompleted, addTask, toggleTaskDone, extendTask, deleteTask,
    schedule, selectedSemester, changeSemester, addSchedule, removeSchedule,
    calendarEvents, selectedCalDay, selectCalDay, addAgenda,
    reminders, addReminder, updateReminder, deleteReminder, toggleReminder,
    activeTasksCount, overdueCount, activeRemindersCount,
  };

  return (
    <PlannerContext.Provider value={value}>
      {plannerDataReady ? children : <div className="h-screen w-screen bg-[#F7FAFC]" aria-busy="true" />}
    </PlannerContext.Provider>
  );
}
