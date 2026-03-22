import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Plus, Edit2, Trash2, MapPin, Clock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface Excursion {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  location: string;
  imageUrl: string;
}

export function ManageExcursionsPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || profile?.role !== 'guide') {
      navigate('/profile');
      return;
    }

    const fetchExcursions = async () => {
      try {
        const q = query(collection(db, 'excursions'), where('guideId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedExcursions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Excursion[];
        setExcursions(fetchedExcursions);
      } catch (error) {
        console.error("Error fetching excursions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExcursions();
  }, [user, profile, navigate]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que deseja eliminar esta experiência?')) {
      try {
        await deleteDoc(doc(db, 'excursions', id));
        setExcursions(prev => prev.filter(exc => exc.id !== id));
      } catch (error) {
        console.error("Error deleting excursion:", error);
        alert("Erro ao eliminar a experiência.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-[#F8F9FA] min-h-screen pb-24"
    >
      {/* Header */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-heading font-bold text-[#212529]">As Minhas Experiências</h1>
        </div>
        <Link 
          to="/create-excursion"
          className="w-10 h-10 rounded-full bg-[#2EC4B6] flex items-center justify-center text-white hover:bg-[#25a89c] transition-colors shadow-sm"
        >
          <Plus size={20} />
        </Link>
      </header>

      <div className="px-5 pt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : excursions.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E9ECEF] text-center">
            <div className="w-16 h-16 bg-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#6C757D]">
              <MapPin size={32} />
            </div>
            <h2 className="text-lg font-heading font-bold text-[#212529] mb-2">Ainda não tem experiências</h2>
            <p className="text-[#6C757D] text-sm mb-6">
              Crie a sua primeira experiência para começar a receber reservas de exploradores.
            </p>
            <Link 
              to="/create-excursion"
              className="inline-flex items-center justify-center gap-2 bg-[#212529] text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              <Plus size={20} />
              Criar Experiência
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {excursions.map(excursion => (
              <div key={excursion.id} className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] overflow-hidden flex flex-col sm:flex-row">
                <div className="h-40 sm:h-auto sm:w-40 shrink-0 relative">
                  <img 
                    src={excursion.imageUrl || 'https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?auto=format&fit=crop&q=80'} 
                    alt={excursion.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-bold text-[#212529] text-lg leading-tight pr-4">
                      {excursion.title}
                    </h3>
                    <div className="flex gap-2 shrink-0">
                      <button className="text-[#6C757D] hover:text-[#2EC4B6] transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(excursion.id)}
                        className="text-[#6C757D] hover:text-[#FF6B35] transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-[#6C757D] mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {excursion.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {excursion.duration}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-3 border-t border-[#F8F9FA] flex justify-between items-center">
                    <span className="font-bold text-[#FF6B35]">
                      {excursion.price.toLocaleString('pt-MZ')} <span className="text-xs font-medium">{excursion.currency || 'MZN'}</span>
                    </span>
                    <span className="text-xs font-medium bg-[#E9ECEF] text-[#6C757D] px-2 py-1 rounded-md">
                      Ativo
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
