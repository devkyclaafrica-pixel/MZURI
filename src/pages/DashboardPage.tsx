import { motion } from 'motion/react';
import { Bell, PlusCircle, Map, Star, Calendar, BarChart3, FileText, CreditCard, ChevronRight } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role === 'explorer' || !profile?.role) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#F8F9FA] pb-24"
    >
      {/* Top Bar */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-[#212529]">Painel</h1>
        <button 
          onClick={() => navigate('/notifications')}
          className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors relative"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B35] rounded-full border-2 border-[#F8F9FA]"></span>
        </button>
      </header>

      <div className="px-5 pt-6 flex-1 flex flex-col gap-6">
        
        {/* Welcome Section */}
        <div>
          <h2 className="text-lg font-bold text-[#212529] mb-1">
            Olá, {profile?.displayName?.split(' ')[0] || 'Parceiro'}! 👋
          </h2>
          <p className="text-[#6C757D] text-sm">
            O que pretende fazer hoje?
          </p>
        </div>

        {/* Quick Actions - Create */}
        <div>
          <h3 className="text-sm font-bold text-[#212529] uppercase tracking-wider mb-3">Criar</h3>
          <div className="grid grid-cols-3 gap-3">
            <QuickActionCard 
              icon={<Calendar size={24} className="text-[#0D6EFD]" />}
              label="Evento"
              onClick={() => navigate('/create-event')}
              bgColor="bg-[#E7F1FF]"
            />
            <QuickActionCard 
              icon={<Map size={24} className="text-[#2EC4B6]" />}
              label="Excursão"
              onClick={() => navigate('/create-excursion')}
              bgColor="bg-[#E8F8F5]"
            />
            <QuickActionCard 
              icon={<Star size={24} className="text-[#FFD166]" />}
              label="Experiência"
              onClick={() => navigate('/create-experience')}
              bgColor="bg-[#FFF9E6]"
            />
          </div>
        </div>

        {/* Management Options */}
        <div>
          <h3 className="text-sm font-bold text-[#212529] uppercase tracking-wider mb-3">Gestão</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] overflow-hidden">
            <MenuOption 
              icon={<FileText size={20} className="text-[#6C757D]" />} 
              label="Ver publicações" 
              onClick={() => navigate('/manage-publications')}
            />
            <div className="h-px bg-[#E9ECEF] mx-4" />
            <MenuOption 
              icon={<BarChart3 size={20} className="text-[#2EC4B6]" />} 
              label="Ver desempenho" 
              onClick={() => navigate('/performance')}
            />
            <div className="h-px bg-[#E9ECEF] mx-4" />
            <MenuOption 
              icon={<CreditCard size={20} className="text-[#FF6B35]" />} 
              label="Gerir plano" 
              onClick={() => navigate('/plans')}
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function QuickActionCard({ icon, label, onClick, bgColor }: { icon: React.ReactNode, label: string, onClick: () => void, bgColor: string }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-[#E9ECEF] shadow-sm hover:border-[#2EC4B6] transition-colors"
    >
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-1`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-[#212529] text-center">{label}</span>
    </button>
  );
}

function MenuOption({ icon, label, badge, textColor = "text-[#212529]", onClick }: { icon: React.ReactNode, label: string, badge?: string, textColor?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <span className={`font-medium text-sm ${textColor}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-[#FF6B35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight size={16} className="text-[#6C757D]" />
      </div>
    </button>
  );
}
