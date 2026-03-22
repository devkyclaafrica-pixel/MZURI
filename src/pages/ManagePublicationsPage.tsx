import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Map, Star, Calendar, Edit2, Trash2, MoreVertical, Plus } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data for publications
const MOCK_PUBLICATIONS = [
  {
    id: '1',
    title: 'Safari no Parque Nacional da Gorongosa',
    type: 'excursion',
    status: 'active',
    price: '15.000 MZN',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    date: 'Diário'
  },
  {
    id: '2',
    title: 'Aula de Culinária: Matapa com Caranguejo',
    type: 'experience',
    status: 'active',
    price: '2.500 MZN',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800',
    date: 'Sábados'
  },
  {
    id: '3',
    title: 'Festival de Verão MZ 2026',
    type: 'event',
    status: 'draft',
    price: '1.000 MZN',
    image: 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?auto=format&fit=crop&q=80&w=800',
    date: '15 Dez 2026'
  }
];

export function ManagePublicationsPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'excursion' | 'experience' | 'event'>('all');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role === 'explorer' || !profile?.role) {
    return <Navigate to="/profile" replace />;
  }

  const filteredPublications = MOCK_PUBLICATIONS.filter(
    pub => activeTab === 'all' || pub.type === activeTab
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'excursion': return <Map size={16} className="text-[#2EC4B6]" />;
      case 'experience': return <Star size={16} className="text-[#FFD166]" />;
      case 'event': return <Calendar size={16} className="text-[#0D6EFD]" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'excursion': return 'Excursão';
      case 'experience': return 'Experiência';
      case 'event': return 'Evento';
      default: return '';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="bg-[#E8F8F5] text-[#2EC4B6] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Ativo</span>;
    }
    return <span className="bg-[#F8F9FA] text-[#6C757D] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-[#E9ECEF]">Rascunho</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#F8F9FA]"
    >
      {/* Top Bar */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-heading font-bold text-[#212529]">Publicações</h1>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-[#212529] flex items-center justify-center text-white hover:bg-black transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <TabButton 
            active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')} 
            label="Todas" 
          />
          <TabButton 
            active={activeTab === 'excursion'} 
            onClick={() => setActiveTab('excursion')} 
            label="Excursões" 
          />
          <TabButton 
            active={activeTab === 'experience'} 
            onClick={() => setActiveTab('experience')} 
            label="Experiências" 
          />
          <TabButton 
            active={activeTab === 'event'} 
            onClick={() => setActiveTab('event')} 
            label="Eventos" 
          />
        </div>
      </header>

      <div className="px-5 pt-6 pb-24 flex flex-col gap-4">
        {filteredPublications.length > 0 ? (
          filteredPublications.map((pub) => (
            <div key={pub.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E9ECEF] flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#F8F9FA]">
                <img src={pub.image} alt={pub.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-[#212529] text-sm leading-tight line-clamp-2">
                      {pub.title}
                    </h3>
                    <button className="text-[#ADB5BD] hover:text-[#212529] transition-colors shrink-0">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6C757D] mb-2">
                    {getTypeIcon(pub.type)}
                    <span>{getTypeLabel(pub.type)}</span>
                    <span className="w-1 h-1 rounded-full bg-[#DEE2E6]"></span>
                    <span>{pub.date}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#212529] text-sm">{pub.price}</span>
                  {getStatusBadge(pub.status)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#ADB5BD]">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#212529] mb-2">Sem publicações</h3>
            <p className="text-[#6C757D] text-sm mb-6">
              Ainda não criou nenhuma publicação nesta categoria.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#212529] text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-colors"
            >
              Criar Nova
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
        active 
          ? 'bg-[#212529] text-white' 
          : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]'
      }`}
    >
      {label}
    </button>
  );
}
