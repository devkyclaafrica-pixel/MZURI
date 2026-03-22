import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Heart, MapPin, Star, Share2, Info, Navigation } from 'lucide-react';
import { MOCK_LOCATIONS, MOCK_EXCURSIONS } from '../data/mock';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';

export function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, toggleFavorite } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ title: '', description: '' });
  
  const location = MOCK_LOCATIONS.find(loc => loc.id === id);
  const relatedExcursions = MOCK_EXCURSIONS.filter(exc => exc.locationId === id);

  if (!location) {
    return <div className="p-8 text-center">Local não encontrado</div>;
  }

  const isFavorite = profile?.favorites?.includes(location.id) || false;

  const handleProtectedAction = async (action: 'favorite') => {
    if (!user) {
      setAuthModalConfig({
        title: 'Guarde os seus favoritos',
        description: 'Crie uma conta para guardar os locais que mais gosta e aceder-lhes mais tarde.'
      });
      setIsAuthModalOpen(true);
      return;
    }
    
    if (action === 'favorite') {
      await toggleFavorite(location.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-[#F8F9FA] min-h-screen pb-24"
    >
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        title={authModalConfig.title}
        description={authModalConfig.description}
      />
      
      {/* Hero Image & Header */}
      <div className="relative h-[45vh] w-full">
        <img 
          src={location.imageUrl} 
          alt={location.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-12 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => handleProtectedAction('favorite')}
              className={`w-10 h-10 rounded-full liquid-glass flex items-center justify-center transition-colors ${
                isFavorite ? 'text-[#FF6B35] bg-white' : 'text-white hover:bg-white/30'
              }`}
            >
              <Heart size={20} className={isFavorite ? 'fill-[#FF6B35]' : ''} />
            </button>
          </div>
        </div>

        {/* Title Area */}
        <div className="absolute bottom-6 left-5 right-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#2EC4B6] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {location.category}
            </span>
            <div className="flex items-center gap-1 text-white/90 text-sm font-medium">
              <Star size={14} className="fill-[#FFD166] text-[#FFD166]" />
              <span>{location.rating}</span>
              <span className="text-white/60">({location.reviewsCount})</span>
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-white leading-tight mb-1">
            {location.title}
          </h1>
          <div className="flex items-center text-white/80 text-sm">
            <MapPin size={16} className="mr-1" />
            <span>{location.subtitle}</span>
            {location.distance && (
              <>
                <span className="mx-2">•</span>
                <span>{location.distance}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 -mt-4 relative bg-[#F8F9FA] rounded-t-3xl z-20">
        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 bg-white border border-[#E9ECEF] rounded-2xl py-3 px-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-[#F8F9FA] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E9ECEF] flex items-center justify-center text-[#2EC4B6]">
              <Navigation size={20} />
            </div>
            <span className="text-xs font-medium text-[#212529]">Como Chegar</span>
          </button>
          <button className="flex-1 bg-white border border-[#E9ECEF] rounded-2xl py-3 px-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-[#F8F9FA] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E9ECEF] flex items-center justify-center text-[#FF6B35]">
              <Info size={20} />
            </div>
            <span className="text-xs font-medium text-[#212529]">Dicas Práticas</span>
          </button>
        </div>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-[#212529] mb-3">Sobre o Local</h2>
          <p className="text-[#6C757D] text-sm leading-relaxed">
            {location.description}
          </p>
        </section>

        {/* Excursions */}
        {relatedExcursions.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-heading font-semibold text-[#212529]">Experiências Disponíveis</h2>
            </div>
            <div className="flex flex-col gap-4">
              {relatedExcursions.map(excursion => (
                <div key={excursion.id} className="flex gap-4 bg-white border border-[#E9ECEF] p-3 rounded-2xl shadow-sm">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={excursion.imageUrl} 
                      alt={excursion.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h4 className="font-heading font-semibold text-[#212529] text-sm line-clamp-2 leading-tight mb-1">
                        {excursion.title}
                      </h4>
                      <p className="text-[#6C757D] text-xs">{excursion.guideName}</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <p className="font-bold text-[#FF6B35] text-sm">
                        {excursion.price.toLocaleString('pt-MZ')} <span className="text-[10px] font-medium">{excursion.currency}</span>
                      </p>
                      <button 
                        onClick={() => navigate(`/excursion/${excursion.id}`)}
                        className="bg-[#2EC4B6] text-white text-xs font-bold px-3 py-1.5 rounded-full"
                      >
                        Ver Mais
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
