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

function AppFooter({ className }: { className: string }) {
  return (
    <footer className={`h-8 shrink-0 items-center justify-center gap-1.5 border-t border-[#B3B9BF]/30 bg-white text-xs leading-none text-[#4D687D] ${className}`}>
      <span>made by</span>
      <Heart aria-hidden="true" className="h-3.5 w-3.5 fill-[#791A0A] text-[#791A0A]" />
      <span>kelompok 1</span>
    </footer>
  );
}

export default function AppShell() {
  const { mobileNavOpen, toggleMobileNav, page } = usePlanner();
  const isProfilePage = page === 'profile';

  return (
    <>
      <div className="flex w-full flex-col xl:h-screen xl:overflow-hidden">
        <div className="w-full flex flex-col xl:flex-1 xl:min-h-0 xl:overflow-hidden xl:flex-row">
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
            <main id="main-scroll-area" className="flex-1 xl:min-h-0 xl:overflow-y-auto">
              <div className="relative flex min-h-[calc(100dvh-4rem)] w-full flex-col bg-white pt-1">
                <FloatingAddButton />
                <div
                  key={page}
                  className={`flex-1 pt-5 schola-grid-container playful-enter sm:pt-6 ${
                    isProfilePage ? 'pb-0' : 'pb-3'
                  }`}
                >
                  <CurrentPage />
                </div>
              </div>
              <AppFooter className="hidden xl:flex" />
            </main>
          </div>

          {/* Column 3: focus panel */}
          {page !== 'profile' && <FocusPanel />}
        </div>
        <AppFooter className="flex xl:hidden" />
      </div>

      <Modals />
      <Toast />
    </>
  );
}
