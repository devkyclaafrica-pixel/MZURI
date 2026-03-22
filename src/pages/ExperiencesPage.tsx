import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Star, Heart, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_EXPERIENCES, Experience } from '../data/mock';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export function ExperiencesPage() {
  const { user, profile, toggleFavorite } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [activeDuration, setActiveDuration] = useState('Qualquer');
  const [activeLocation, setActiveLocation] = useState('Qualquer');
  const [activePrice, setActivePrice] = useState('Qualquer');

  const durations = ['Qualquer', 'Até 2h', '2h - 4h', 'Mais de 4h'];
  const locations = ['Qualquer', 'Maputo', 'Inhambane', 'Vilanculos', 'Nampula'];
  const prices = ['Qualquer', 'Até 1000 MZN', '1000 - 3000 MZN', 'Mais de 3000 MZN'];

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const q = query(collection(db, 'experiences'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
        
        // Combine with mocks
        setExperiences([...fetched, ...MOCK_EXPERIENCES]);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        setExperiences(MOCK_EXPERIENCES);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const handleProtectedAction = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      await toggleFavorite(itemId);
    }
  };

  const filteredExperiences = experiences.filter(exp => {
    // Search
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Duration
    let matchesDuration = true;
    if (activeDuration === 'Até 2h') matchesDuration = exp.durationHours <= 2;
    else if (activeDuration === '2h - 4h') matchesDuration = exp.durationHours > 2 && exp.durationHours <= 4;
    else if (activeDuration === 'Mais de 4h') matchesDuration = exp.durationHours > 4;

    // Location
    let matchesLocation = true;
    if (activeLocation !== 'Qualquer') {
      matchesLocation = exp.location.toLowerCase().includes(activeLocation.toLowerCase());
    }

    // Price
    let matchesPrice = true;
    if (activePrice === 'Até 1000 MZN') matchesPrice = exp.price <= 1000;
    else if (activePrice === '1000 - 3000 MZN') matchesPrice = exp.price > 1000 && exp.price <= 3000;
    else if (activePrice === 'Mais de 3000 MZN') matchesPrice = exp.price > 3000;

    return matchesSearch && matchesDuration && matchesLocation && matchesPrice;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#F8F9FA] pb-24"
    >
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-heading font-bold text-[#212529] mb-4">Experiências</h1>
        
        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-[#6C757D]" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar experiências..."
              className="block w-full pl-10 pr-3 py-3 border border-[#E9ECEF] rounded-2xl leading-5 bg-[#F8F9FA] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] sm:text-sm transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors">
            <Filter size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          {/* Duration Filter */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider whitespace-nowrap">Duração:</span>
            {durations.map(dur => (
              <button
                key={dur}
                onClick={() => setActiveDuration(dur)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeDuration === dur 
                    ? 'bg-[#2EC4B6] text-white' 
                    : 'bg-[#F8F9FA] text-[#6C757D] border border-[#E9ECEF] hover:bg-[#E9ECEF]'
                }`}
              >
                {dur}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider whitespace-nowrap">Local:</span>
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => setActiveLocation(loc)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeLocation === loc 
                    ? 'bg-[#2EC4B6] text-white' 
                    : 'bg-[#F8F9FA] text-[#6C757D] border border-[#E9ECEF] hover:bg-[#E9ECEF]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider whitespace-nowrap">Preço:</span>
            {prices.map(price => (
              <button
                key={price}
                onClick={() => setActivePrice(price)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activePrice === price 
                    ? 'bg-[#2EC4B6] text-white' 
                    : 'bg-[#F8F9FA] text-[#6C757D] border border-[#E9ECEF] hover:bg-[#E9ECEF]'
                }`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      <div className="px-5 pt-6 flex-1">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredExperiences.length > 0 ? (
          <div className="flex flex-col gap-5">
            {filteredExperiences.map(experience => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience} 
                onFavorite={(e) => handleProtectedAction(e, experience.id)} 
                isFavorite={profile?.favorites?.includes(experience.id) || false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#6C757D]">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-heading font-semibold text-[#212529] mb-2">Nenhuma experiência encontrada</h3>
            <p className="text-[#6C757D] text-sm">Tente ajustar os seus filtros ou pesquisa.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ExperienceCard({ experience, onFavorite, isFavorite }: { experience: Experience, onFavorite: (e: React.MouseEvent) => void, isFavorite: boolean }) {
  return (
    <Link to={`/experience/${experience.id}`} className="group block bg-white rounded-[24px] p-3 shadow-sm border border-[#E9ECEF] hover:shadow-md transition-all">
      <div className="flex gap-4">
        <div className="relative w-[110px] h-[130px] rounded-[18px] overflow-hidden shrink-0">
          <img 
            src={experience.imageUrl} 
            alt={experience.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
            <img src={experience.hostAvatar} alt={experience.hostName} className="w-full h-full object-cover" />
          </div>
          <button 
            onClick={onFavorite}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
              isFavorite ? 'bg-white text-[#FF6B35]' : 'bg-white/30 text-white hover:bg-white hover:text-[#FF6B35]'
            }`}
          >
            <Heart size={12} className={isFavorite ? 'fill-[#FF6B35]' : ''} />
          </button>
        </div>
        
        <div className="flex flex-col justify-between flex-1 py-1 pr-1">
          <div>
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-1 bg-[#F8F9FA] px-2 py-1 rounded-md">
                <Star size={10} className="fill-[#FFD166] text-[#FFD166]" />
                <span className="text-[10px] font-bold text-[#212529]">{experience.rating}</span>
              </div>
              <span className="text-[#6C757D] text-[10px] font-medium bg-[#F8F9FA] px-2 py-1 rounded-md flex items-center gap-1">
                <Clock size={10} />
                {experience.duration}
              </span>
            </div>
            
            <h4 className="font-heading font-bold text-[#212529] text-base leading-tight mb-1 group-hover:text-[#2EC4B6] transition-colors">
              {experience.title}
            </h4>
            <div className="flex items-center gap-1 text-[#6C757D] text-xs font-medium mb-1">
              <MapPin size={12} />
              <span>{experience.location}</span>
            </div>
            <p className="text-[#6C757D] text-[10px] font-medium">por {experience.hostName}</p>
          </div>
          
          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="font-bold text-[#FF6B35] text-lg leading-none">
                {experience.price.toLocaleString('pt-MZ')} <span className="text-xs font-medium text-[#FF6B35]/80">{experience.currency}</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] group-hover:bg-[#2EC4B6] group-hover:text-white transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
