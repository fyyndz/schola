'use client';

import { usePlanner } from '@/context/PlannerContext';
import AddAgendaModal from './AddAgendaModal';
import AddReminderModal from './AddReminderModal';
import AddScheduleModal from './AddScheduleModal';
import AddStudyCardModal from './AddStudyCardModal';
import AddTaskModal from './AddTaskModal';
import EditProfileModal from './EditProfileModal';
import LogoutModal from './LogoutModal';
import StudyDetailModal from './StudyDetailModal';

/** Modal hanya di-mount saat aktif, sehingga form otomatis reset tiap dibuka. */
export default function Modals() {
  const { modal } = usePlanner();
  switch (modal.id) {
    case 'addStudyCardModal':
      return <AddStudyCardModal />;
    case 'addTaskModal':
      return <AddTaskModal />;
    case 'addScheduleModal':
      return <AddScheduleModal />;
    case 'addAgendaModal':
      return <AddAgendaModal />;
    case 'addReminderModal':
      return <AddReminderModal />;
    case 'editProfileModal':
      return <EditProfileModal />;
    case 'studyDetailModal':
      return <StudyDetailModal />;
    case 'logoutModal':
      return <LogoutModal />;
    default:
      return null;
  }
}
