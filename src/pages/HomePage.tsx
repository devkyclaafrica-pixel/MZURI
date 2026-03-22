import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, Search, Filter, ArrowRight, Compass, Palmtree, Tent, Music, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_LOCATIONS, MOCK_EXCURSIONS, Location, Excursion } from '../data/mock';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export function HomePage() {
  const featuredLocation = MOCK_LOCATIONS[0];
  const trendingLocations = MOCK_LOCATIONS.slice(1);
  const { user, profile, toggleFavorite } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [excursions, setExcursions] = useState<Excursion[]>(MOCK_EXCURSIONS);

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        const q = query(collection(db, 'excursions'), orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Excursion));
          // Combine fetched excursions with mock excursions, placing new ones first
          setExcursions([...fetched, ...MOCK_EXCURSIONS]);
        }
      } catch (error) {
        console.error("Error fetching excursions:", error);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      className="flex flex-col pb-24 bg-[#F8F9FA] min-h-screen"
    >
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* IMMERSIVE HERO SECTION */}
      <motion.section variants={itemVariants} className="relative h-[65vh] w-full rounded-b-[40px] overflow-hidden shadow-sm">
        <img 
          src={featuredLocation.imageUrl} 
          alt="Featured" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Layered gradients for depth and text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 px-5 pt-12 flex justify-between items-start z-10">
          <div className="liquid-glass-dark px-4 py-2.5 rounded-2xl flex flex-col">
            <span className="text-white/70 text-[10px] uppercase tracking-widest font-semibold mb-0.5">
              {user ? 'Bem-vinda de volta' : 'Olá, Explorador'}
            </span>
            <span className="text-white font-heading font-bold text-lg leading-none">
              {profile?.displayName || 'Visitante'}
            </span>
          </div>
          <Link to="/profile" className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-[#F8F9FA] flex items-center justify-center">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-8 left-5 right-5 z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="liquid-glass-dark text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1">
              <Star size={12} className="text-[#FFD166] fill-[#FFD166]" />
              Destino do Mês
            </span>
          </div>
          
          <h1 className="text-[3.5rem] font-heading font-bold text-white leading-[0.85] tracking-tight mb-6">
            Explore<br/>o Índico.
          </h1>

          {/* Floating Search Bar */}
          <Link to="/search" className="liquid-glass-dark p-2 rounded-2xl flex items-center gap-2 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="bg-white/10 rounded-xl p-3.5 flex-1 flex items-center gap-3">
              <Search className="text-white/80" size={20} />
              <span className="text-white/60 text-sm font-medium">Para onde vamos?</span>
            </div>
            <div className="bg-[#2EC4B6] p-3.5 rounded-xl text-white shadow-lg">
              <Filter size={20} />
            </div>
          </Link>
        </div>
      </motion.section>

      {/* CATEGORIES (Bento-style Pills) */}
      <motion.section variants={itemVariants} className="px-5 -mt-6 relative z-20">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
          <CategoryPill icon={<Palmtree size={18} />} label="Praias" active />
          <CategoryPill icon={<Compass size={18} />} label="Aventura" />
          <CategoryPill icon={<Tent size={18} />} label="Natureza" />
          <CategoryPill icon={<Music size={18} />} label="Cultura" />
        </div>
      </motion.section>

      {/* TRENDING LOCATIONS (Editorial Style) */}
      <motion.section variants={itemVariants} className="pt-6 px-5">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h2 className="text-2xl font-heading font-bold text-[#212529] leading-tight">Destinos<br/>Imperdíveis</h2>
          </div>
          <Link to="/search" className="w-10 h-10 rounded-full border border-[#E9ECEF] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors">
            <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 -mx-5 px-5">
          {trendingLocations.map(location => (
            <TrendingCard 
              key={location.id} 
              location={location} 
              onFavorite={(e) => handleProtectedAction(e, location.id)} 
              isFavorite={profile?.favorites?.includes(location.id) || false}
            />
          ))}
        </div>
      </motion.section>

      {/* CURATED EXPERIENCES */}
      <motion.section variants={itemVariants} className="px-5">
        <div className="flex justify-between items-end mb-5">
          <h2 className="text-2xl font-heading font-bold text-[#212529] leading-tight">Curadoria de<br/>Experiências</h2>
        </div>
        
        <div className="flex flex-col gap-5">
          {excursions.map(excursion => (
            <ExperienceCard 
              key={excursion.id} 
              excursion={excursion} 
              onFavorite={(e) => handleProtectedAction(e, excursion.id)} 
              isFavorite={profile?.favorites?.includes(excursion.id) || false}
            />
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

function CategoryPill({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl whitespace-nowrap transition-all shadow-sm ${
      active 
        ? 'bg-[#212529] text-white shadow-md' 
        : 'bg-white text-[#6C757D] border border-[#E9ECEF] hover:border-[#212529] hover:text-[#212529]'
    }`}>
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function TrendingCard({ location, onFavorite, isFavorite }: { location: Location, onFavorite: (e: React.MouseEvent) => void, isFavorite: boolean }) {
  return (
    <Link to={`/location/${location.id}`} className="min-w-[220px] w-[220px] block group">
      <div className="relative h-[300px] rounded-[24px] overflow-hidden shadow-sm border border-[#E9ECEF]/50">
        <img 
          src={location.imageUrl} 
          alt={location.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        
        {/* Floating Rating */}
        <div className="absolute top-4 right-4 liquid-glass-dark px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <Star size={12} className="fill-[#FFD166] text-[#FFD166]" />
          <span className="text-xs font-bold text-white">{location.rating}</span>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={onFavorite}
          className={`absolute top-4 left-4 w-8 h-8 rounded-full liquid-glass-dark flex items-center justify-center transition-colors ${
            isFavorite ? 'text-[#FF6B35] bg-white' : 'text-white hover:bg-white hover:text-[#FF6B35]'
          }`}
        >
          <Heart size={14} className={isFavorite ? 'fill-[#FF6B35]' : ''} />
        </button>
        
        {/* Content */}
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-[#2EC4B6] text-[10px] font-bold uppercase tracking-widest mb-1">{location.category}</p>
          <h3 className="text-white font-heading font-bold text-xl leading-tight mb-1.5">{location.title}</h3>
          <div className="flex items-center text-white/70 text-xs font-medium">
            <MapPin size={12} className="mr-1" />
            <span className="truncate">{location.subtitle}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ExperienceCard({ excursion, onFavorite, isFavorite }: { excursion: Excursion, onFavorite: (e: React.MouseEvent) => void, isFavorite: boolean }) {
  return (
    <Link to={`/excursion/${excursion.id}`} className="group block bg-white rounded-[24px] p-3 shadow-sm border border-[#E9ECEF] hover:shadow-md transition-all">
      <div className="flex gap-4">
        {/* Image with overlapping avatar */}
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
        
        {/* Details */}
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

