import { NavLink } from 'react-router-dom'
import { useAuth } from ../../context/auth-context
import { LoginPage } from '../../pages/login-page';

export default function DoctorSidebar() {
  const { user, updateProfileImage } = useAuth();
 
  const initials = user?.name
    ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'D';
 
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      updateProfileImage(base64);
      try {
        await updateUser(user.id, { profile_image: base64 });
      } catch (err) {
        console.error('Failed to update profile image:', err);
      }
    };
    reader.readAsDataURL(file);
  };
 
  const cls = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full text-left ${
      isActive ? 'bg-teal text-white font-medium' : 'text-white/50'
    }`;
 
  return (
    <aside className="w-60 shrink-0 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto z-[60]" style={{ background: '#1a2332' }}>
      <NavLink to="/" className="px-5 py-6 border-b border-white/10">
        <span className="font-display font-bold text-[19px] text-white">Book<span style={{ color: '#5CD6C4' }}>Pro</span></span>
      </NavLink>
      <div className="flex-1 px-3 py-4 flex flex-col">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 pt-1 pb-2">Main</p>
        {doctorNavItems.map(item => (
          <NavLink key={item.label} to={item.to} end={item.end} className={cls}>
            <span>{item.icon}</span>{item.label}
          </NavLink>
        ))}
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 pt-4 pb-2">Account</p>
        {doctorAccountItems.map(item => (
          <NavLink key={item.label} to={item.to} className={cls}>
            <span>{item.icon}</span>{item.label}
          </NavLink>
        ))}
        <div className="flex-1" />
        <NavLink to="/doctor/appointments" className="flex items-center gap-2 px-3 py-2.5 mt-4 rounded-lg text-sm font-medium transition-colors" style={{ background: 'rgba(92,214,196,0.13)', border: '1px solid rgba(92,214,196,0.25)', color: '#5CD6C4' }}>
          <span>+</span> New Appointment
        </NavLink>
        <div className="mt-3 px-3 py-3 rounded-lg flex items-center gap-2.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <label htmlFor="doctor-profile-upload" className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-xs font-semibold shrink-0 cursor-pointer overflow-hidden relative">
            {user?.profile_image ? (
              <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </label>
          <input
            id="doctor-profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <div>
            <p className="text-white text-[13px] font-medium leading-tight">{user?.name || 'Dr. User'}</p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{user?.role === 'doctor' ? 'Doctor' : 'Staff'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}