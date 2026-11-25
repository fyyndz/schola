'use client';

import { usePlanner } from '@/context/PlannerContext';
import Toast from '@/components/ui/Toast';
import Modals from '@/components/modals/Modals';
import DashboardPage from '@/components/pages/DashboardPage';
import TasksPage from '@/components/pages/TasksPage';
import SchedulePage from '@/components/pages/SchedulePage';
import CalendarPage from '@/components/pages/CalendarPage';
import RemindersPage from '@/components/pages/RemindersPage';
import ProfilePage from '@/components/pages/ProfilePage';
import MobileHeader from './MobileHeader';
import Sidebar from './Sidebar';
import Header from './Header';
import FloatingAddButton from './FloatingAddButton';
import FocusPanel from './FocusPanel';

function CurrentPage() {
  const { page } = usePlanner();
  switch (page) {
    case 'dashboard':
      return <DashboardPage />;
    case 'tasks':
      return <TasksPage />;
    case 'schedule':
      return <SchedulePage />;
    case 'calendar':
      return <CalendarPage />;
    case 'reminders':
      return <RemindersPage />;
    case 'profile':
      return <ProfilePage />;
  }
}

export default function AppShell() {
  const { mobileNavOpen, toggleMobileNav } = usePlanner();

  return (
    <>
      <div className="min-h-screen w-full flex flex-col xl:h-screen xl:w-screen xl:overflow-hidden xl:flex-row">
        <MobileHeader />

        {/* Mobile sidebar backdrop */}
        <div
          onClick={toggleMobileNav}
          className={`fixed inset-0 bg-[#052948]/40 backdrop-blur-xs z-40 ${mobileNavOpen ? 'xl:hidden' : 'hidden'}`}
        />

        <Sidebar />

        {/* Column 2: main canvas */}
        <div className="flex-1 bg-[#F7FAFC] flex flex-col relative min-w-0 xl:overflow-hidden">
          <Header />
          <main className="flex-1 schola-grid-container pb-24 pt-1 xl:min-h-0 xl:overflow-y-auto">
            <div className="relative bg-white">
              <FloatingAddButton />
              <CurrentPage />
            </div>
          </main>
        </div>

        {/* Column 3: focus panel */}
        <FocusPanel />
      </div>

      <Modals />
      <Toast />
    </>
  );
}
