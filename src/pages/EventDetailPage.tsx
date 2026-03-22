import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Heart, Share2, Calendar, MapPin, Users, Ticket, Clock, ExternalLink, MessageCircle, Map as MapIcon } from 'lucide-react';
import { MOCK_EVENTS, Event } from '../data/mock';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { db } from '../firebase';
import { collection, doc, getDoc, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, toggleFavorite } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ title: '', description: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      // Check mock first
      const mockEvent = MOCK_EVENTS.find(evt => evt.id === id);
      if (mockEvent) {
        setEvent(mockEvent);
        setLoading(false);
        return;
      }

      // Fetch from Firestore
      try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-12 h-12 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return <div className="p-8 text-center">Evento não encontrado</div>;
  }

  const isFavorite = profile?.favorites?.includes(event.id) || false;

  const handleProtectedAction = async (action: 'favorite' | 'contact') => {
    if (!user) {
      setAuthModalConfig({
        title: action === 'favorite' ? 'Guarde os seus favoritos' : 'Contactar Organizador',
        description: action === 'favorite' 
          ? 'Crie uma conta para guardar os eventos que mais gosta e aceder-lhes mais tarde.'
          : 'Crie uma conta para enviar mensagens diretamente aos organizadores.'
      });
      setIsAuthModalOpen(true);
      return;
    }
    
    if (action === 'favorite') {
      await toggleFavorite(event.id);
    } else if (action === 'contact') {
      setIsBooking(true);
      try {
        const organizerId = `organizer_${event.id}`; // In a real app, use actual organizer ID
        
        const q = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        let existingChatId = null;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.participants.includes(organizerId) && data.eventId === event.id) {
            existingChatId = doc.id;
          }
        });

        if (existingChatId) {
          navigate(`/chat/${existingChatId}`);
        } else {
          // Create a new chat document
          const chatRef = await addDoc(collection(db, 'chats'), {
            participants: [user.uid, organizerId],
            eventId: event.id,
            eventTitle: event.title,
            lastMessage: 'Nova conversa iniciada',
            lastMessageTime: serverTimestamp(),
            unreadCount: {
              [organizerId]: 1
            },
            participantDetails: {
              [user.uid]: {
                displayName: profile?.displayName || 'Explorador',
                photoURL: profile?.photoURL || ''
              },
              [organizerId]: {
                displayName: 'Organizador do Evento',
                photoURL: ''
              }
            }
          });
          
          await addDoc(collection(db, 'chats', chatRef.id, 'messages'), {
            chatId: chatRef.id,
            senderId: user.uid,
            text: `Olá! Tenho interesse no evento "${event.title}".`,
            createdAt: serverTimestamp()
          });
          
          // Navigate to the new chat
          navigate(`/chat/${chatRef.id}`);
        }
      } catch (error) {
        console.error("Error creating chat:", error);
        alert("Não foi possível iniciar o chat. Tente novamente mais tarde.");
      } finally {
        setIsBooking(false);
      }
    }
  };

  const handleAddToCalendar = () => {
    // In a real app, this would generate an .ics file or open Google Calendar link
    alert('Funcionalidade "Adicionar ao Calendário" em desenvolvimento. Em breve poderá sincronizar diretamente com o seu calendário!');
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
          src={event.imageUrl} 
          alt={event.title} 
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
                {event.category}
              </span>
              {event.isTrending && (
                <span className="bg-[#FFF0EB] text-[#FF6B35] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1">
                  Em Alta
                </span>
              )}
            </div>
            <h1 className="text-2xl font-heading font-bold text-[#212529] leading-tight mb-2">
              {event.title}
            </h1>
            <div className="flex items-center text-[#6C757D] text-sm font-medium">
              <MapPin size={14} className="mr-1" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 py-4 border-y border-[#E9ECEF] mb-6">
          <img src={event.organizerAvatar} alt={event.organizerName} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="text-sm font-bold text-[#212529]">Organizado por {event.organizerName}</p>
            <p className="text-xs text-[#6C757D]">Organizador verificado</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 bg-[#F8F9FA] p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2EC4B6] shadow-sm">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[#6C757D] uppercase font-semibold">Data</p>
              <p className="text-sm font-bold text-[#212529]">{event.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#F8F9FA] p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2EC4B6] shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[#6C757D] uppercase font-semibold">Hora</p>
              <p className="text-sm font-bold text-[#212529]">{event.time}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleAddToCalendar}
          className="w-full py-3 mb-8 rounded-xl border-2 border-[#E9ECEF] text-[#212529] font-bold flex items-center justify-center gap-2 hover:bg-[#F8F9FA] transition-colors"
        >
          <Calendar size={18} />
          Adicionar ao Calendário
        </button>

        <div className="mb-8">
          <h3 className="text-lg font-heading font-bold text-[#212529] mb-3">Sobre o evento</h3>
          <p className="text-[#6C757D] text-sm leading-relaxed">
            {event.description || 'Junte-se a nós para um evento inesquecível. Prepare-se para uma experiência única com muita animação, cultura e oportunidades de networking. Não perca esta oportunidade de fazer parte de algo especial na nossa comunidade.'}
          </p>
        </div>

        {/* Map Placeholder */}
        <div className="mb-8">
          <h3 className="text-lg font-heading font-bold text-[#212529] mb-3">Localização</h3>
          <div className="bg-[#F8F9FA] rounded-2xl h-48 flex flex-col items-center justify-center text-[#6C757D] border border-[#E9ECEF]">
            <MapIcon size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">Mapa indisponível</p>
            <p className="text-xs">{event.location}</p>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#E9ECEF] p-5 pb-8 z-50 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[#6C757D] text-xs font-medium mb-0.5">Preço do bilhete</p>
            {event.price === 0 ? (
              <p className="font-bold text-[#2EC4B6] text-2xl leading-none">Gratuito</p>
            ) : (
              <p className="font-bold text-[#212529] text-2xl leading-none">
                {event.price.toLocaleString('pt-MZ')} <span className="text-sm font-medium text-[#6C757D]">{event.currency}</span>
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => handleProtectedAction('contact')}
            disabled={isBooking}
            className="flex-1 bg-[#212529] text-white py-3.5 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-black/10 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            {isBooking ? 'Aguarde...' : 'Participar / Contactar'}
          </button>
          
          {event.externalLink && (
            <a 
              href={event.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#2EC4B6] text-white py-3.5 rounded-xl font-bold hover:bg-[#25A599] transition-colors shadow-lg shadow-[#2EC4B6]/20 flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              Saber mais
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
