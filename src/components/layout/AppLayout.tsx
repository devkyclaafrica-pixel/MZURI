import { Outlet, useLocation } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';

export function AppLayout() {
  const location = useLocation();
  const isDetailPage = location.pathname.includes('/location/') || 
                       location.pathname.includes('/excursion/') || 
                       location.pathname.includes('/experience/') || 
                       location.pathname.includes('/event/');

  return (
    <div className={`min-h-screen bg-[#F8F9FA] ${!isDetailPage ? 'pb-24' : ''}`}>
      <main className="w-full max-w-md mx-auto min-h-screen bg-white shadow-sm relative overflow-hidden">
        <Outlet />
        {!isDetailPage && <BottomTabBar />}
      </main>
    </div>
  );
}
