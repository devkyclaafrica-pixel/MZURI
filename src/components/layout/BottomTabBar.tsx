import { NavLink } from 'react-router-dom';
import { Compass, Map, Star, Calendar, User } from 'lucide-react';
import { clsx } from 'clsx';

export function BottomTabBar() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 pb-6 pt-2">
      <div className="liquid-glass rounded-full flex items-center justify-around py-3 px-2 shadow-sm">
        <TabItem to="/" icon={<Compass size={24} />} label="Explorar" />
        <TabItem to="/excursions" icon={<Map size={24} />} label="Excursões" />
        <TabItem to="/experiences" icon={<Star size={24} />} label="Experiências" />
        <TabItem to="/events" icon={<Calendar size={24} />} label="Eventos" />
        <TabItem to="/profile" icon={<User size={24} />} label="Perfil" />
      </div>
    </div>
  );
}

function TabItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors',
          isActive ? 'text-[#2EC4B6]' : 'text-[#6C757D] hover:text-[#212529]'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className={clsx('transition-transform duration-200', isActive && 'scale-110')}>
            {icon}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}
