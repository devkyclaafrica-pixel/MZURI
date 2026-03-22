import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_LOCATIONS, Location } from '../data/mock';

export function SearchPage() {
  const [query, setQuery] = useState('');
  
  const filteredLocations = MOCK_LOCATIONS.filter(loc => 
    loc.title.toLowerCase().includes(query.toLowerCase()) || 
    loc.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    loc.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#F8F9FA] pb-24"
    >
      {/* Header & Search Bar */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-heading font-bold text-[#212529] mb-4">Pesquisar</h1>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-[#6C757D]" />
            </div>
            <input
              type="text"
              placeholder="Destinos, experiências..."
              className="block w-full pl-10 pr-3 py-3 border border-[#E9ECEF] rounded-2xl leading-5 bg-[#F8F9FA] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] sm:text-sm transition-shadow"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors">
            <Filter size={20} />
          </button>
        </div>
        
        {/* Quick Filters */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar mt-4 pb-2">
          {['Praia', 'Natureza', 'Cultural', 'Eventos', 'Aventura'].map((filter) => (
            <button 
              key={filter}
              onClick={() => setQuery(filter)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-[#F8F9FA] text-[#6C757D] border border-[#E9ECEF] hover:bg-[#E9ECEF] transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Results */}
      <div className="px-5 pt-6 flex-1">
        <h2 className="text-lg font-heading font-semibold text-[#212529] mb-4">
          {query ? `Resultados para "${query}"` : 'Destinos Populares'}
        </h2>
        
        <div className="flex flex-col gap-4">
          {filteredLocations.map(location => (
            <SearchLocationCard key={location.id} location={location} />
          ))}
          
          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#6C757D]">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-heading font-semibold text-[#212529] mb-2">Nenhum resultado encontrado</h3>
              <p className="text-[#6C757D] text-sm">Tente pesquisar por outros termos ou categorias.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SearchLocationCard({ location }: { location: Location }) {
  return (
    <Link to={`/location/${location.id}`} className="flex gap-4 bg-white border border-[#E9ECEF] p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
        <img 
          src={location.imageUrl} 
          alt={location.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1">
          <Star size={10} className="fill-[#FFD166] text-[#FFD166]" />
          <span className="text-[10px] font-bold text-[#212529]">{location.rating}</span>
        </div>
      </div>
      
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-heading font-semibold text-[#212529] text-sm line-clamp-2 leading-tight pr-2">
              {location.title}
            </h4>
          </div>
          <p className="text-[#6C757D] text-xs flex items-center gap-1 mb-1">
            <MapPin size={12} />
            {location.subtitle}
          </p>
          <span className="inline-block bg-[#F3E8D9] text-[#FF6B35] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {location.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
