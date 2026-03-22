import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Star, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_EXCURSIONS, Excursion } from '../data/mock';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export function ExcursionsPage() {
  const { user, profile, toggleFavorite } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', 'Aventura', 'Praia', 'Cultural', 'Natureza', 'Gastronomia'];

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        const q = query(collection(db, 'excursions'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Excursion));
        
        // Combine with mocks
        setExcursions([...fetched, ...MOCK_EXCURSIONS]);
      } catch (error) {
        console.error("Error fetching excursions:", error);
        setExcursions(MOCK_EXCURSIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchExcursions();
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

  const filteredExcursions = excursions.filter(exc => {
    const matchesSearch = exc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || exc.category === activeCategory;
    return matchesSearch && matchesCategory;
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold text-[#212529]">Excursões</h1>
          {profile?.role === 'guide' && (
            <Link 
              to="/create-excursion"
              className="bg-[#2EC4B6] text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-[#25a89c] transition-colors"
            >
              Criar
            </Link>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-[#6C757D]" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar excursões..."
              className="block w-full pl-10 pr-3 py-3 border border-[#E9ECEF] rounded-2xl leading-5 bg-[#F8F9FA] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] sm:text-sm transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors">
            <Filter size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#212529] text-white' 
                  : 'bg-[#F8F9FA] text-[#6C757D] border border-[#E9ECEF] hover:bg-[#E9ECEF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>
      
      <div className="px-5 pt-6 flex-1">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredExcursions.length > 0 ? (
          <div className="flex flex-col gap-5">
            {filteredExcursions.map(excursion => (
              <ExperienceCard 
                key={excursion.id} 
                excursion={excursion} 
                onFavorite={(e) => handleProtectedAction(e, excursion.id)} 
                isFavorite={profile?.favorites?.includes(excursion.id) || false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#6C757D]">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-heading font-semibold text-[#212529] mb-2">Nenhuma excursão encontrada</h3>
            <p className="text-[#6C757D] text-sm">Tente ajustar os seus filtros ou pesquisa.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ExperienceCard({ excursion, onFavorite, isFavorite }: { excursion: Excursion, onFavorite: (e: React.MouseEvent) => void, isFavorite: boolean }) {
  return (
    <Link to={`/excursion/${excursion.id}`} className="group block bg-white rounded-[24px] p-3 shadow-sm border border-[#E9ECEF] hover:shadow-md transition-all">
      <div className="flex gap-4">
        <div className="relative w-[110px] h-[130px] rounded-[18px] overflow-hidden shrink-0">
          <img 
            src={excursion.imageUrl} 
            alt={excursion.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
            <img src={excursion.guideAvatar} alt={excursion.guideName} className="w-full h-full object-cover" />
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
                <span className="text-[10px] font-bold text-[#212529]">{excursion.rating}</span>
              </div>
              <span className="text-[#6C757D] text-[10px] font-medium bg-[#F8F9FA] px-2 py-1 rounded-md">{excursion.duration}</span>
            </div>
            
            <h4 className="font-heading font-bold text-[#212529] text-base leading-tight mb-1 group-hover:text-[#2EC4B6] transition-colors">
              {excursion.title}
            </h4>
            <p className="text-[#6C757D] text-xs font-medium">por {excursion.guideName}</p>
          </div>
          
          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-[#6C757D] text-[10px] uppercase tracking-wider font-semibold mb-0.5">A partir de</p>
              <p className="font-bold text-[#FF6B35] text-lg leading-none">
                {excursion.price.toLocaleString('pt-MZ')} <span className="text-xs font-medium text-[#FF6B35]/80">{excursion.currency}</span>
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
