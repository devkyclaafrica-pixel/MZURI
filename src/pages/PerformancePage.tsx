import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, TrendingUp, Users, Eye, Star, Calendar, Map, ArrowUpRight, Heart, MousePointerClick, Share2 } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PERFORMANCE_DATA = [
  { name: 'Jan', views: 1200, interactions: 150 },
  { name: 'Fev', views: 1800, interactions: 220 },
  { name: 'Mar', views: 2400, interactions: 380 },
  { name: 'Abr', views: 2100, interactions: 310 },
  { name: 'Mai', views: 3500, interactions: 490 },
  { name: 'Jun', views: 4200, interactions: 650 },
];

const TOP_PUBLICATIONS = [
  {
    id: '1',
    title: 'Safari no Parque Nacional da Gorongosa',
    type: 'excursion',
    views: 3450,
    favorites: 145,
    rating: 4.9
  },
  {
    id: '2',
    title: 'Aula de Culinária: Matapa com Caranguejo',
    type: 'experience',
    views: 2100,
    favorites: 89,
    rating: 4.8
  }
];

export function PerformancePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [timeRange, setTimeRange] = useState<'month' | 'year' | 'all'>('year');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role === 'explorer' || !profile?.role) {
    return <Navigate to="/profile" replace />;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'excursion': return <Map size={14} className="text-[#2EC4B6]" />;
      case 'experience': return <Star size={14} className="text-[#FFD166]" />;
      case 'event': return <Calendar size={14} className="text-[#0D6EFD]" />;
      default: return null;
    }
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
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-heading font-bold text-[#212529]">Desempenho</h1>
        </div>

        {/* Time Range Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <FilterButton 
            active={timeRange === 'month'} 
            onClick={() => setTimeRange('month')} 
            label="Este Mês" 
          />
          <FilterButton 
            active={timeRange === 'year'} 
            onClick={() => setTimeRange('year')} 
            label="Este Ano" 
          />
          <FilterButton 
            active={timeRange === 'all'} 
            onClick={() => setTimeRange('all')} 
            label="Sempre" 
          />
        </div>
      </header>

      <div className="px-5 pt-6 pb-24 flex flex-col gap-6">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-4">
          <KpiCard 
            title="Visualizações" 
            value="15.2k" 
            trend="+24%" 
            icon={<Eye size={20} className="text-[#2EC4B6]" />} 
            bgColor="bg-[#E8F8F5]"
          />
          <KpiCard 
            title="Favoritos" 
            value="842" 
            trend="+12%" 
            icon={<Heart size={20} className="text-[#FF6B35]" />} 
            bgColor="bg-[#FFF0EB]"
          />
          <KpiCard 
            title="Cliques (Contacto)" 
            value="356" 
            trend="+18%" 
            icon={<MousePointerClick size={20} className="text-[#0D6EFD]" />} 
            bgColor="bg-[#E7F1FF]"
          />
          <KpiCard 
            title="Partilhas" 
            value="128" 
            trend="+5%" 
            icon={<Share2 size={20} className="text-[#FFD166]" />} 
            bgColor="bg-[#FFF9E6]"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E9ECEF]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#212529]">Evolução de Visualizações</h2>
            <span className="text-xs font-bold text-[#2EC4B6] bg-[#E8F8F5] px-2 py-1 rounded-md">
              Visitas
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6C757D' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6C757D' }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [value.toLocaleString(), 'Visualizações']}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#2EC4B6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Publications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#212529]">Melhores Publicações</h2>
            <button className="text-sm font-bold text-[#0D6EFD] hover:underline">Ver todas</button>
          </div>
          <div className="flex flex-col gap-3">
            {TOP_PUBLICATIONS.map((pub) => (
              <div key={pub.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#E9ECEF] flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#212529] text-sm leading-tight line-clamp-2 mb-1">
                      {pub.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6C757D]">
                      {getTypeIcon(pub.type)}
                      <span className="capitalize">{pub.type === 'excursion' ? 'Excursão' : 'Experiência'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FFF9E6] px-2 py-1 rounded-md shrink-0">
                    <Star size={12} className="text-[#FFD166] fill-[#FFD166]" />
                    <span className="text-xs font-bold text-[#212529]">{pub.rating}</span>
                  </div>
                </div>
                
                <div className="h-px bg-[#E9ECEF] w-full" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-[#6C757D] uppercase tracking-wider font-bold mb-0.5">Visualizações</span>
                    <span className="text-sm font-bold text-[#212529]">{pub.views.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-[#6C757D] uppercase tracking-wider font-bold mb-0.5">Favoritos</span>
                    <span className="text-sm font-bold text-[#FF6B35]">{pub.favorites}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
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

function KpiCard({ title, value, trend, icon, bgColor }: { title: string, value: string, trend: string, icon: React.ReactNode, bgColor: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E9ECEF] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[#2EC4B6] bg-[#E8F8F5] px-2 py-1 rounded-md">
          <ArrowUpRight size={12} />
          <span className="text-[10px] font-bold">{trend}</span>
        </div>
      </div>
      <div>
        <h3 className="text-xs text-[#6C757D] font-medium mb-1">{title}</h3>
        <span className="text-lg font-bold text-[#212529]">{value}</span>
      </div>
    </div>
  );
}
