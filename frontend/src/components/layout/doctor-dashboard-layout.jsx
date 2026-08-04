import DoctorSidebar from '../doctor/doctor-sidebar.jsx';
import { useAuth } from '../../context/auth-context';

export default function DoctorDashboardLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-surface ml-60">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col min-w-0 pt-16">{children}</div>
    </div>
  );
}