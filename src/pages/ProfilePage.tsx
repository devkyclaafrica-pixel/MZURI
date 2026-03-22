import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Settings, Heart, Bell, HelpCircle, LogOut, ChevronRight, ShieldCheck, LayoutDashboard, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../firebase';
import { AuthModal } from '../components/ui/AuthModal';

export function ProfilePage() {
  const { user, profile, setGuestMode, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    if (user) {
      await logOut();
    } else {
      setGuestMode(false);
    }
    navigate('/auth');
  };

  const handleBecomePartner = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    navigate('/become-partner');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#F8F9FA] pb-24"
    >
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          title="Tornar-se Parceiro"
          description="Crie uma conta para começar a partilhar as suas experiências e ganhar dinheiro com o MZURI."
        />
      
      {/* Header */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-heading font-bold text-[#212529] mb-4">Perfil</h1>
      </header>

      {/* Profile Info */}
      <div className="px-5 pt-6 flex-1">
        <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-[#E9ECEF] mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2EC4B6] shrink-0 bg-[#F8F9FA] flex items-center justify-center">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName || 'User'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-heading font-bold text-[#212529] truncate">
              {profile?.displayName || 'Visitante'}
            </h2>
            <p className="text-[#6C757D] text-sm truncate">
              {profile?.email || 'Faça login para guardar os seus dados'}
            </p>
            {profile?.role && (
              <span className="inline-block bg-[#F3E8D9] text-[#FF6B35] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mt-1">
                {profile.role === 'guide' ? 'Guia Verificado' : 'Explorador'}
              </span>
            )}
          </div>
          <button 
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors shrink-0"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] overflow-hidden mb-6">
          <MenuOption 
            icon={<Heart size={20} className="text-[#FF6B35]" />} 
            label="Favoritos" 
            onClick={() => navigate('/favorites')}
          />
          <div className="h-px bg-[#E9ECEF] mx-4" />
          <MenuOption 
            icon={<Bell size={20} className="text-[#2EC4B6]" />} 
            label="Notificações" 
            badge="3" 
            onClick={() => navigate('/notifications')}
          />
          <div className="h-px bg-[#E9ECEF] mx-4" />
          <MenuOption 
            icon={<ShieldCheck size={20} className="text-[#0D6EFD]" />} 
            label="Privacidade e Segurança" 
            onClick={() => navigate('/privacy')}
          />
          <div className="h-px bg-[#E9ECEF] mx-4" />
          <MenuOption 
            icon={<MapPin size={20} className="text-[#2EC4B6]" />} 
            label="Sugerir Lugar" 
            onClick={() => navigate('/suggest-place')}
          />
        </div>

        {/* Partner Specific Options */}
        {(profile?.role === 'guide' || profile?.role === 'agency' || profile?.role === 'organizer') && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] overflow-hidden mb-6">
            <MenuOption 
              icon={<LayoutDashboard size={20} className="text-[#2EC4B6]" />} 
              label="Painel do Parceiro" 
              onClick={() => navigate('/dashboard')}
            />
            <div className="h-px bg-[#E9ECEF] mx-4" />
            <MenuOption 
              icon={<User size={20} className="text-black/50" />} 
              label="Dev: Voltar a Explorador" 
              onClick={() => updateProfile({ role: 'explorer' })}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] overflow-hidden mb-8">
          <MenuOption 
            icon={<HelpCircle size={20} className="text-[#6C757D]" />} 
            label="Ajuda e Suporte" 
            onClick={() => navigate('/support')}
          />
          <div className="h-px bg-[#E9ECEF] mx-4" />
          <MenuOption 
            icon={<LogOut size={20} className="text-[#DC3545]" />} 
            label={user ? "Terminar Sessão" : "Entrar / Criar Conta"} 
            textColor="text-[#DC3545]" 
            onClick={handleLogout}
          />
        </div>
        
        {/* Become a Partner Banner */}
        {(!profile || profile.role === 'explorer') && (
          <div className="bg-gradient-to-br from-[#2EC4B6] to-[#1a9b8f] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-heading font-bold text-lg mb-1">Queres ser nosso parceiro?</h3>
              <p className="text-white/80 text-sm mb-4 max-w-[80%]">
                Regista-te como Guia, Agência ou Organizador de Eventos e alcança mais clientes.
              </p>
              <button 
                onClick={handleBecomePartner}
                className="bg-white text-[#2EC4B6] font-bold py-2 px-4 rounded-full text-sm shadow-sm hover:bg-[#F8F9FA] transition-colors"
              >
                Tornar-se parceiro
              </button>
              {user && (
                <button 
                  onClick={() => updateProfile({ role: 'guide' })}
                  className="mt-2 bg-black/20 text-white font-bold py-2 px-4 rounded-full text-xs shadow-sm hover:bg-black/30 transition-colors block"
                >
                  Dev: Tornar-me Guia Auto
                </button>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-20">
              <User size={120} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
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
