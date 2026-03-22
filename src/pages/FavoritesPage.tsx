import { motion } from 'motion/react';
import { Heart, MapPin, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_LOCATIONS, MOCK_EXCURSIONS, Location, Excursion } from '../data/mock';

export function FavoritesPage() {
  const { profile, toggleFavorite } = useAuth();

  const favoriteLocations = MOCK_LOCATIONS.filter(loc => profile?.favorites?.includes(loc.id));
  const favoriteExcursions = MOCK_EXCURSIONS.filter(exc => profile?.favorites?.includes(exc.id));

  const hasFavorites = favoriteLocations.length > 0 || favoriteExcursions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#F8F9FA] pb-24"
    >
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-heading font-bold text-[#212529]">Favoritos</h1>
      </header>

      <div className="px-5 pt-6 flex-1">
        {!hasFavorites ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#6C757D]">
              <Heart size={32} />
            </div>
            <h3 className="text-lg font-heading font-semibold text-[#212529] mb-2">Ainda não tem favoritos</h3>
            <p className="text-[#6C757D] text-sm mb-6">Explore destinos e experiências e guarde os seus favoritos para os encontrar mais tarde.</p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[#2EC4B6] text-white px-6 py-3 rounded-full font-bold hover:bg-[#25a89c] transition-colors"
            >
              Explorar
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {favoriteLocations.length > 0 && (
              <section>
                <h2 className="text-xl font-heading font-semibold text-[#212529] mb-4">Destinos</h2>
                <div className="flex flex-col gap-4">
                  {favoriteLocations.map(location => (
                    <FavoriteLocationCard 
                      key={location.id} 
                      location={location} 
                      onRemove={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(location.id);
                      }} 
                    />
                  ))}
                </div>
              </section>
            )}

            {favoriteExcursions.length > 0 && (
              <section>
                <h2 className="text-xl font-heading font-semibold text-[#212529] mb-4">Experiências</h2>
                <div className="flex flex-col gap-4">
                  {favoriteExcursions.map(excursion => (
                    <FavoriteExcursionCard 
                      key={excursion.id} 
                      excursion={excursion} 
                      onRemove={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(excursion.id);
                      }} 
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FavoriteLocationCard({ location, onRemove }: { location: Location, onRemove: (e: React.MouseEvent) => void }) {
  return (
    <Link to={`/location/${location.id}`} className="flex gap-4 bg-white border border-[#E9ECEF] p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
        <img 
          src={location.imageUrl} 
          alt={location.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
            <button 
              onClick={onRemove}
              className="text-[#FF6B35] hover:text-[#e55a2b] transition-colors p-1 -mr-1 -mt-1"
            >
              <Heart size={16} className="fill-[#FF6B35]" />
            </button>
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

function FavoriteExcursionCard({ excursion, onRemove }: { excursion: Excursion, onRemove: (e: React.MouseEvent) => void }) {
  return (
    <Link to={`/excursion/${excursion.id}`} className="flex gap-4 bg-white border border-[#E9ECEF] p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
        <img 
          src={excursion.imageUrl} 
          alt={excursion.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1">
          <Star size={10} className="fill-[#FFD166] text-[#FFD166]" />
          <span className="text-[10px] font-bold text-[#212529]">{excursion.rating}</span>
        </div>
      </div>
      
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-heading font-semibold text-[#212529] text-sm line-clamp-2 leading-tight pr-2">
              {excursion.title}
            </h4>
            <button 
              onClick={onRemove}
              className="text-[#FF6B35] hover:text-[#e55a2b] transition-colors p-1 -mr-1 -mt-1"
            >
              <Heart size={16} className="fill-[#FF6B35]" />
            </button>
          </div>
          <p className="text-[#6C757D] text-xs mb-1">por {excursion.guideName}</p>
        </div>
        <div className="flex justify-between items-end mt-1">
          <p className="font-bold text-[#FF6B35] text-sm leading-none">
            {excursion.price.toLocaleString('pt-MZ')} <span className="text-[10px] font-medium text-[#FF6B35]/80">{excursion.currency}</span>
          </p>
          <span className="text-[#6C757D] text-[10px] font-medium bg-[#F8F9FA] px-2 py-1 rounded-md">{excursion.duration}</span>
        </div>
      </div>
    </Link>
  );
}
