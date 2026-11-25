'use client';

import { Heart } from 'lucide-react';
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
  const { mobileNavOpen, toggleMobileNav, page } = usePlanner();

  return (
    <>
      <div className="flex min-h-screen w-full flex-col xl:h-screen xl:overflow-hidden">
        <div className="min-h-screen w-full flex-1 flex flex-col xl:min-h-0 xl:overflow-hidden xl:flex-row">
          <MobileHeader />

          {/* Mobile sidebar backdrop */}
          <div
            onClick={toggleMobileNav}
            className={`fixed inset-0 bg-[#052948]/40 backdrop-blur-xs z-40 ${mobileNavOpen ? 'xl:hidden' : 'hidden'}`}
          />

          <Sidebar />

          {/* Column 2: main canvas */}
          <div className="relative flex min-w-0 flex-1 flex-col bg-[#F7FAFC] xl:overflow-hidden">
            <Header />
            <main className="flex-1 schola-grid-container pb-24 pt-1 xl:min-h-0 xl:overflow-y-auto">
              <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col bg-white">
                <FloatingAddButton />
                <div className="flex-1 pb-3">
                  <CurrentPage />
                </div>
              </div>
            </main>
          </div>

          {/* Column 3: focus panel */}
          {page !== 'profile' && <FocusPanel />}
        </div>
        <footer className="flex shrink-0 items-center justify-center gap-1.5 border-t border-[#B3B9BF]/30 bg-white py-4 text-xs text-[#4D687D]">
          <span>made by</span>
          <Heart aria-hidden="true" className="h-3.5 w-3.5 fill-[#791A0A] text-[#791A0A]" />
          <span>kelompok 1</span>
        </footer>
      </div>

      <Modals />
      <Toast />
    </>
  );
}
