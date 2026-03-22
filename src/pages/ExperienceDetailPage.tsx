import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Heart, Share2, Star, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { MOCK_EXPERIENCES, Experience } from '../data/mock';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, toggleFavorite } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ title: '', description: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      // Check mock first
      const mockExperience = MOCK_EXPERIENCES.find(exp => exp.id === id);
      if (mockExperience) {
        setExperience(mockExperience);
        setLoading(false);
        return;
      }

      // Fetch from Firestore
      try {
        const docRef = doc(db, 'experiences', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExperience({ id: docSnap.id, ...docSnap.data() } as Experience);
        }
      } catch (error) {
        console.error("Error fetching experience:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-12 h-12 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!experience) {
    return <div className="p-8 text-center">Experiência não encontrada</div>;
  }

  const isFavorite = profile?.favorites?.includes(experience.id) || false;

  const handleProtectedAction = async (action: 'favorite' | 'book') => {
    if (!user) {
      setAuthModalConfig({
        title: action === 'favorite' ? 'Guarde os seus favoritos' : 'Contacte o anfitrião',
        description: action === 'favorite' 
          ? 'Crie uma conta para guardar as experiências que mais gosta e aceder-lhes mais tarde.'
          : 'Crie uma conta para contactar o anfitrião e planear esta experiência incrível.'
      });
      setIsAuthModalOpen(true);
      return;
    }
    
    if (action === 'favorite') {
      await toggleFavorite(experience.id);
    } else if (action === 'book') {
      setIsBooking(true);
      try {
        const hostId = `host_${experience.id}`;
        
        const q = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        let existingChatId = null;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.participants.includes(hostId) && data.experienceId === experience.id) {
            existingChatId = doc.id;
          }
        });

        if (existingChatId) {
          navigate(`/chat/${existingChatId}`);
        } else {
          const chatRef = await addDoc(collection(db, 'chats'), {
            participants: [user.uid, hostId],
            experienceId: experience.id,
            experienceTitle: experience.title,
            lastMessage: 'Nova conversa iniciada',
            lastMessageTime: serverTimestamp(),
            unreadCount: {
              [hostId]: 1
            },
            participantDetails: {
              [user.uid]: {
                displayName: profile?.displayName || 'Explorador',
                photoURL: profile?.photoURL || ''
              },
              [hostId]: {
                displayName: experience.hostName,
                photoURL: experience.hostAvatar
              }
            }
          });
          
          await addDoc(collection(db, 'chats', chatRef.id, 'messages'), {
            chatId: chatRef.id,
            senderId: user.uid,
            text: `Olá! Tenho interesse na experiência "${experience.title}".`,
            createdAt: serverTimestamp()
          });

          navigate(`/chat/${chatRef.id}`);
        }
      } catch (error) {
        console.error("Error creating chat:", error);
        alert("Ocorreu um erro ao contactar o anfitrião. Tente novamente.");
      } finally {
        setIsBooking(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen pb-32"
    >
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        title={authModalConfig.title}
        description={authModalConfig.description}
      />

      {/* Hero Image */}
      <div className="relative h-[45vh] w-full">
        <img 
          src={experience.imageUrl} 
          alt={experience.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 px-5 pt-12 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full liquid-glass-dark flex items-center justify-center text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full liquid-glass-dark flex items-center justify-center text-white">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => handleProtectedAction('favorite')}
              className={`w-10 h-10 rounded-full liquid-glass-dark flex items-center justify-center transition-colors ${
                isFavorite ? 'text-[#FF6B35] bg-white' : 'text-white'
              }`}
            >
              <Heart size={20} className={isFavorite ? 'fill-[#FF6B35]' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 -mt-6 relative bg-white rounded-t-[32px]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#F8F9FA] text-[#2EC4B6] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
                {experience.category}
              </span>
              <div className="flex items-center gap-1 text-[#212529]">
                <Star size={14} className="fill-[#FFD166] text-[#FFD166]" />
                <span className="text-sm font-bold">{experience.rating}</span>
                <span className="text-[#6C757D] text-xs">({experience.reviewsCount})</span>
              </div>
            </div>
            <h1 className="text-2xl font-heading font-bold text-[#212529] leading-tight mb-2">
              {experience.title}
            </h1>
            <div className="flex items-center text-[#6C757D] text-sm font-medium">
              <MapPin size={14} className="mr-1" />
              <span>{experience.location}</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate(`/guide/guide_${experience.id}`)}
          className="flex items-center gap-4 py-4 border-y border-[#E9ECEF] mb-6 cursor-pointer hover:bg-[#F8F9FA] transition-colors rounded-xl px-2 -mx-2"
        >
          <img src={experience.hostAvatar} alt={experience.hostName} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="text-sm font-bold text-[#212529]">Organizado por {experience.hostName}</p>
            <p className="text-xs text-[#6C757D]">Anfitrião verificado</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 bg-[#F8F9FA] p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2EC4B6] shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[#6C757D] uppercase font-semibold">Duração</p>
              <p className="text-sm font-bold text-[#212529]">{experience.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#F8F9FA] p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2EC4B6] shadow-sm">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[#6C757D] uppercase font-semibold">Grupo</p>
              <p className="text-sm font-bold text-[#212529]">Até 6 pax</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-heading font-bold text-[#212529] mb-3">Sobre a experiência</h3>
          <p className="text-[#6C757D] text-sm leading-relaxed">
            Junte-se a mim para uma experiência autêntica e inesquecível. Vamos explorar a cultura local, 
            aprender novas habilidades e criar memórias que durarão para sempre. Esta atividade foi 
            cuidadosamente desenhada para proporcionar uma imersão verdadeira no nosso modo de vida.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-heading font-bold text-[#212529] mb-3">O que está incluído</h3>
          <ul className="space-y-3">
            {['Equipamento necessário', 'Bebidas refrescantes', 'Guia local experiente'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#212529]">
                <CheckCircle2 size={18} className="text-[#2EC4B6]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#E9ECEF] p-5 pb-8 z-50 flex items-center justify-between">
        <div>
          <p className="text-[#6C757D] text-xs font-medium mb-0.5">Preço por pessoa</p>
          <p className="font-bold text-[#212529] text-2xl leading-none">
            {experience.price.toLocaleString('pt-MZ')} <span className="text-sm font-medium text-[#6C757D]">{experience.currency}</span>
          </p>
        </div>
        <button 
          onClick={() => handleProtectedAction('book')}
          disabled={isBooking}
          className="bg-[#212529] text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-colors shadow-lg shadow-black/10 disabled:opacity-70"
        >
          {isBooking ? 'A contactar...' : 'Contactar'}
        </button>
      </div>
    </motion.div>
  );
}
