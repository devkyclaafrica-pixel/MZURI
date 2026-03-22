import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Calendar, MapPin, ArrowRight, Heart, Users, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_EVENTS, Event } from '../data/mock';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export function EventsPage() {
  const { user, profile, toggleFavorite } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [activeDate, setActiveDate] = useState('Qualquer');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeLocation, setActiveLocation] = useState('Qualquer');

  const dates = ['Qualquer', 'Hoje', 'Este fim de semana'];
  const categories = ['Todos', 'Música', 'Cultural', 'Festa', 'Negócios', 'Exposições', 'Social'];
  const locations = ['Qualquer', 'Maputo', 'Inhambane', 'Vilanculos', 'Nampula'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        
        // Combine with mocks
        setEvents([...fetched, ...MOCK_EVENTS]);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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

  const trendingEvents = events.filter(evt => evt.isTrending);

  const filteredEvents = events.filter(evt => {
    // Search
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date
    let matchesDate = true;
    if (activeDate !== 'Qualquer') {
      matchesDate = evt.date.toLowerCase().includes(activeDate.toLowerCase());
    }

    // Category
    const matchesCategory = activeCategory === 'Todos' || evt.category === activeCategory;

    // Location
    let matchesLocation = true;
    if (activeLocation !== 'Qualquer') {
      matchesLocation = evt.location.toLowerCase().includes(activeLocation.toLowerCase());
    }

    return matchesSearch && matchesDate && matchesCategory && matchesLocation;
  });

  // Generate simple calendar days for the UI
  const calendarDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: d.toLocaleDateString('pt-PT', { weekday: 'short' }).replace('.', ''),
      dayNumber: d.getDate(),
      fullDate: d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
    };
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-heading font-bold text-[#212529]">Eventos</h1>
          <div className="flex gap-2 text-[#212529]">
            <Calendar size={24} />
            <MapPin size={24} />
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-[#6C757D]" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar eventos..."
              className="block w-full pl-10 pr-3 py-3 border border-[#E9ECEF] rounded-2xl leading-5 bg-[#F8F9FA] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] sm:text-sm transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors">
            <Filter size={20} />
          </button>
        </div>

        {/* Calendar Strip */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
          {calendarDays.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDate(i === 0 ? 'Hoje' : day.fullDate)}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[72px] rounded-2xl border transition-all ${
                (activeDate === 'Hoje' && i === 0) || activeDate === day.fullDate
                  ? 'bg-[#2EC4B6] border-[#2EC4B6] text-white shadow-md shadow-[#2EC4B6]/20'
                  : 'bg-white border-[#E9ECEF] text-[#212529] hover:border-[#2EC4B6]'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase mb-1 ${
                (activeDate === 'Hoje' && i === 0) || activeDate === day.fullDate ? 'text-white/80' : 'text-[#6C757D]'
              }`}>
                {day.dayName}
              </span>
              <span className="text-lg font-bold leading-none">{day.dayNumber}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          {/* Date Filter (Quick) */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider whitespace-nowrap">Data:</span>
            {dates.map(d => (
              <button
                key={d}
                onClick={() => setActiveDate(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeDate === d 
                    ? 'bg-[#2EC4B6] text-white' 
                    : 'bg-[#F8F9FA] text-[#6C757D] border border-[#E9ECEF] hover:bg-[#E9ECEF]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider whitespace-nowrap">Categoria:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-[#2EC4B6] text-white' 
                    : 'bg-[#F8F9FA] text-[#6C757D] border border-[#E9ECEF] hover:bg-[#E9ECEF]'
                }`}
              >
                {cat}
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
        </div>
      </header>
      
      <div className="pt-6 flex-1">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Trending Events Section */}
            {trendingEvents.length > 0 && activeCategory === 'Todos' && activeDate === 'Qualquer' && activeLocation === 'Qualquer' && !searchQuery && (
              <div className="mb-8">
                <div className="px-5 flex items-center gap-2 mb-4">
                  <Flame size={20} className="text-[#FF6B35]" />
                  <h2 className="text-lg font-heading font-bold text-[#212529]">Eventos em alta</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 pb-4">
                  {trendingEvents.map(event => (
                    <div key={event.id} className="w-[280px] shrink-0">
                      <EventCard 
                        event={event} 
                        onFavorite={(e) => handleProtectedAction(e, event.id)} 
                        isFavorite={profile?.favorites?.includes(event.id) || false}
                        compact
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Events List */}
            <div className="px-5">
              <h2 className="text-lg font-heading font-bold text-[#212529] mb-4">
                {searchQuery || activeCategory !== 'Todos' || activeDate !== 'Qualquer' || activeLocation !== 'Qualquer' 
                  ? 'Resultados da pesquisa' 
                  : 'Todos os eventos'}
              </h2>
              
              {filteredEvents.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {filteredEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onFavorite={(e) => handleProtectedAction(e, event.id)} 
                      isFavorite={profile?.favorites?.includes(event.id) || false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#6C757D]">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-[#212529] mb-2">Nenhum evento encontrado</h3>
                  <p className="text-[#6C757D] text-sm">Tente ajustar os seus filtros ou pesquisa.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function EventCard({ event, onFavorite, isFavorite, compact = false }: { event: Event, onFavorite: (e: React.MouseEvent) => void, isFavorite: boolean, compact?: boolean }) {
  return (
    <Link to={`/event/${event.id}`} className="group block bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#E9ECEF] hover:shadow-md transition-all h-full flex flex-col">
      <div className={`relative w-full ${compact ? 'h-32' : 'h-40'}`}>
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex flex-col items-center justify-center min-w-[40px]">
          <span className="text-[10px] font-bold text-[#FF6B35] uppercase leading-none mb-0.5">
            {event.date.split(' ')[1] || event.date.substring(0, 3)}
          </span>
          <span className="text-sm font-bold text-[#212529] leading-none">
            {event.date.split(' ')[0]}
          </span>
        </div>

        <button 
          onClick={onFavorite}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
            isFavorite ? 'bg-white text-[#FF6B35]' : 'bg-white/30 text-white hover:bg-white hover:text-[#FF6B35]'
          }`}
        >
          <Heart size={14} className={isFavorite ? 'fill-[#FF6B35]' : ''} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex items-center gap-2">
            <span className="bg-[#2EC4B6] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">
              {event.category}
            </span>
          </div>
          {!compact && (
            <div className="flex items-center gap-1 text-white text-xs font-medium">
              <Users size={12} />
              <span>{event.attendees}+</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h4 className={`font-heading font-bold text-[#212529] leading-tight mb-2 group-hover:text-[#2EC4B6] transition-colors ${compact ? 'text-base line-clamp-1' : 'text-lg'}`}>
          {event.title}
        </h4>
        
        <div className="flex flex-col gap-1.5 mb-3 flex-1">
          <div className="flex items-center gap-1.5 text-[#6C757D] text-sm font-medium">
            <Calendar size={14} className="shrink-0" />
            <span className="truncate">{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6C757D] text-sm font-medium">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-[#E9ECEF] mt-auto">
          <div className="flex items-center gap-2 overflow-hidden">
            <img src={event.organizerAvatar} alt={event.organizerName} className="w-6 h-6 rounded-full object-cover shrink-0" />
            <span className="text-xs font-medium text-[#6C757D] truncate">{event.organizerName}</span>
          </div>
          
          <div className="text-right shrink-0 ml-2">
            {event.price === 0 ? (
              <span className="font-bold text-[#2EC4B6] text-base">Gratuito</span>
            ) : (
              <p className="font-bold text-[#FF6B35] text-base leading-none">
                {event.price.toLocaleString('pt-MZ')} <span className="text-[10px] font-medium text-[#FF6B35]/80">{event.currency}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
