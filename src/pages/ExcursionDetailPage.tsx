import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Heart, Share2, Star, Clock, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { MOCK_EXCURSIONS, Excursion } from '../data/mock';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export function ExcursionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, toggleFavorite } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ title: '', description: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExcursion = async () => {
      if (!id) return;
      
      // Check mock first
      const mockExcursion = MOCK_EXCURSIONS.find(exc => exc.id === id);
      if (mockExcursion) {
        setExcursion(mockExcursion);
        setLoading(false);
        return;
      }

      // Fetch from Firestore
      try {
        const docRef = doc(db, 'excursions', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExcursion({ id: docSnap.id, ...docSnap.data() } as Excursion);
        }
      } catch (error) {
        console.error("Error fetching excursion:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExcursion();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-12 h-12 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!excursion) {
    return <div className="p-8 text-center">Experiência não encontrada</div>;
  }

  const isFavorite = profile?.favorites?.includes(excursion.id) || false;

  const handleProtectedAction = async (action: 'favorite' | 'book') => {
    if (!user) {
      setAuthModalConfig({
        title: action === 'favorite' ? 'Guarde os seus favoritos' : 'Contacte o guia',
        description: action === 'favorite' 
          ? 'Crie uma conta para guardar as experiências que mais gosta e aceder-lhes mais tarde.'
          : 'Crie uma conta para contactar o guia e planear esta experiência incrível.'
      });
      setIsAuthModalOpen(true);
      return;
    }
    
    if (action === 'favorite') {
      await toggleFavorite(excursion.id);
    } else if (action === 'book') {
      setIsBooking(true);
      try {
        // Create a fake guide ID based on the excursion
        const guideId = `guide_${excursion.id}`;
        
        // Check if chat already exists
        const q = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        let existingChatId = null;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.participants.includes(guideId) && data.excursionId === excursion.id) {
            existingChatId = doc.id;
          }
        });

        if (existingChatId) {
          navigate(`/chat/${existingChatId}`);
        } else {
          // Create new chat
          const chatRef = await addDoc(collection(db, 'chats'), {
            participants: [user.uid, guideId],
            excursionId: excursion.id,
            excursionTitle: excursion.title,
            lastMessage: 'Nova conversa iniciada',
            lastMessageTime: serverTimestamp(),
            unreadCount: {
              [guideId]: 1
            },
            participantDetails: {
              [user.uid]: {
                displayName: profile?.displayName || 'Explorador',
                photoURL: profile?.photoURL || ''
              },
              [guideId]: {
                displayName: excursion.guideName,
                photoURL: excursion.guideAvatar
              }
            }
          });
          
          // Add initial system message
          await addDoc(collection(db, 'chats', chatRef.id, 'messages'), {
            chatId: chatRef.id,
            senderId: user.uid,
            text: `Olá! Tenho interesse na experiência "${excursion.title}".`,
            createdAt: serverTimestamp()
          });

          navigate(`/chat/${chatRef.id}`);
        }
      } catch (error) {
        console.error("Error creating chat:", error);
        alert("Ocorreu um erro ao contactar o guia. Tente novamente.");
      } finally {
        setIsBooking(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-[#F8F9FA] min-h-screen pb-32"
    >
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        title={authModalConfig.title}
        description={authModalConfig.description}
      />
      
      {/* Hero Image & Header */}
      <div className="relative h-[40vh] w-full">
        <img 
          src={excursion.imageUrl} 
          alt={excursion.title} 
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
            <div className="flex items-center gap-1 text-white/90 text-sm font-medium bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
              <Star size={14} className="fill-[#FFD166] text-[#FFD166]" />
              <span>{excursion.rating}</span>
              <span className="text-white/60">({excursion.reviewsCount})</span>
            </div>
          </div>
          <h1 className="text-2xl font-heading font-bold text-white leading-tight mb-2">
            {excursion.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 -mt-4 relative bg-[#F8F9FA] rounded-t-3xl z-20">
        
        {/* Guide Info */}
        <div 
          onClick={() => navigate(`/guide/guide_${excursion.id}`)}
          className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#E9ECEF] mb-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2EC4B6]">
              <img src={excursion.guideAvatar} alt={excursion.guideName} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-[#6C757D] font-medium">Organizado por</p>
              <h3 className="text-[#212529] font-semibold">{excursion.guideName}</h3>
            </div>
          </div>
          <div className="bg-[#E9ECEF] text-[#2EC4B6] p-2 rounded-full">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Quick Details */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white border border-[#E9ECEF] rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm">
            <Clock size={20} className="text-[#2EC4B6]" />
            <span className="text-xs font-medium text-[#6C757D]">Duração</span>
            <span className="text-sm font-bold text-[#212529]">{excursion.duration}</span>
          </div>
          <div className="bg-white border border-[#E9ECEF] rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm">
            <Calendar size={20} className="text-[#FF6B35]" />
            <span className="text-xs font-medium text-[#6C757D]">Disponível</span>
            <span className="text-sm font-bold text-[#212529]">Diário</span>
          </div>
          <div className="bg-white border border-[#E9ECEF] rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm">
            <Users size={20} className="text-[#0D6EFD]" />
            <span className="text-xs font-medium text-[#6C757D]">Grupo</span>
            <span className="text-sm font-bold text-[#212529]">Max 8</span>
          </div>
        </div>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-[#212529] mb-3">Sobre a Experiência</h2>
          <p className="text-[#6C757D] text-sm leading-relaxed">
            Uma experiência inesquecível guiada por especialistas locais. Descubra os segredos mais bem guardados da região enquanto desfruta de paisagens deslumbrantes e cultura autêntica. Todo o equipamento necessário está incluído para garantir o seu conforto e segurança.
          </p>
        </section>

        {/* Included */}
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-[#212529] mb-3">O que está incluído</h2>
          <ul className="space-y-3">
            {['Transporte local', 'Guia especializado', 'Equipamento necessário', 'Água e snacks'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#212529]">
                <div className="w-6 h-6 rounded-full bg-[#E9ECEF] flex items-center justify-center text-[#2EC4B6]">
                  <CheckCircle2 size={14} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#E9ECEF] p-4 pb-8 z-50 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-xs text-[#6C757D] font-medium mb-0.5">Preço por pessoa</p>
          <p className="font-bold text-[#FF6B35] text-xl">
            {excursion.price.toLocaleString('pt-MZ')} <span className="text-sm font-medium">{excursion.currency}</span>
          </p>
        </div>
        <button 
          onClick={() => handleProtectedAction('book')}
          className="bg-[#2EC4B6] text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-[#25a89c] transition-colors"
        >
          Tenho Interesse
        </button>
      </div>
    </motion.div>
  );
}
