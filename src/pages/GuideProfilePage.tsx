import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Share2, Star, MessageCircle, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { MOCK_EXCURSIONS } from '../data/mock';

export function GuideProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Mock guide data based on ID
  const guide = {
    id: id || 'guide_1',
    name: 'Carlos Silva',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    location: 'Maputo, Moçambique',
    rating: 4.9,
    reviewsCount: 128,
    joinedDate: 'Membro desde 2023',
    languages: ['Português', 'Inglês', 'Espanhol'],
    description: 'Olá! Sou o Carlos, um guia local apaixonado por mostrar as belezas escondidas de Moçambique. Com mais de 5 anos de experiência, adoro partilhar a nossa rica cultura, história e paisagens naturais com viajantes de todo o mundo. As minhas excursões são focadas em experiências autênticas e sustentáveis.',
    badges: ['Guia Verificado', 'Super Anfitrião', 'Especialista em Natureza']
  };

  // Mock reviews
  const reviews = [
    {
      id: 1,
      author: 'Ana P.',
      date: 'Novembro 2025',
      rating: 5,
      text: 'O Carlos foi um guia excecional! Conhece a região como ninguém e levou-nos a sítios incríveis que nunca encontraríamos sozinhos.'
    },
    {
      id: 2,
      author: 'Miguel T.',
      date: 'Outubro 2025',
      rating: 5,
      text: 'Uma experiência inesquecível. Muito profissional, simpático e com um conhecimento profundo da história local.'
    },
    {
      id: 3,
      author: 'Sofia M.',
      date: 'Setembro 2025',
      rating: 4,
      text: 'Excelente passeio. O Carlos é muito atencioso e garantiu que todos no grupo estivessem confortáveis.'
    }
  ];

  const handleContact = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsBooking(true);
    try {
      const guideId = guide.id;
      
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid)
      );
      const querySnapshot = await getDocs(q);
      
      let existingChatId = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Check if chat exists with this guide (without specific excursion)
        if (data.participants.includes(guideId) && !data.excursionId && !data.eventId && !data.experienceId) {
          existingChatId = doc.id;
        }
      });

      if (existingChatId) {
        navigate(`/chat/${existingChatId}`);
      } else {
        const chatRef = await addDoc(collection(db, 'chats'), {
          participants: [user.uid, guideId],
          lastMessage: 'Nova conversa iniciada',
          lastMessageTime: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          unreadCount: {
            [guideId]: 1
          },
          participantDetails: {
            [user.uid]: {
              displayName: profile?.displayName || 'Explorador',
              photoURL: profile?.photoURL || ''
            },
            [guideId]: {
              displayName: guide.name,
              photoURL: guide.avatar
            }
          }
        });
        
        await addDoc(collection(db, 'chats', chatRef.id, 'messages'), {
          chatId: chatRef.id,
          senderId: user.uid,
          text: `Olá ${guide.name}! Gostaria de saber mais sobre os seus serviços.`,
          createdAt: serverTimestamp()
        });

        navigate(`/chat/${chatRef.id}`);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Não foi possível iniciar o chat. Tente novamente mais tarde.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de Guia: ${guide.name}`,
        text: `Vê o perfil deste guia incrível no MZURI!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#F8F9FA] min-h-screen pb-24"
    >
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        title="Contacte o guia"
        description="Crie uma conta para enviar uma mensagem a este guia e planear a sua próxima aventura."
      />

      {/* Top Bar */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-heading font-bold text-[#212529]">Perfil do Guia</h1>
        <button 
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
        >
          <Share2 size={20} />
        </button>
      </header>

      <div className="px-5 pt-6">
        {/* Guide Header Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9ECEF] mb-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#2EC4B6] to-[#1a9b8f] opacity-20"></div>
          
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 relative z-10 bg-white">
            <img src={guide.avatar} alt={guide.name} className="w-full h-full object-cover" />
          </div>
          
          <h2 className="text-2xl font-heading font-bold text-[#212529] mb-1 flex items-center justify-center gap-1">
            {guide.name}
            <CheckCircle2 size={18} className="text-[#2EC4B6]" />
          </h2>
          
          <p className="text-[#6C757D] text-sm flex items-center justify-center gap-1 mb-3">
            <MapPin size={14} />
            {guide.location}
          </p>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[#212529] font-bold">
                <Star size={16} className="text-[#FF6B35] fill-[#FF6B35]" />
                <span>{guide.rating}</span>
              </div>
              <span className="text-xs text-[#6C757D]">{guide.reviewsCount} avaliações</span>
            </div>
            <div className="w-px h-8 bg-[#E9ECEF]"></div>
            <div className="flex flex-col items-center">
              <span className="text-[#212529] font-bold">{MOCK_EXCURSIONS.slice(0, 3).length}</span>
              <span className="text-xs text-[#6C757D]">Excursões</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {guide.badges.map((badge, idx) => (
              <span key={idx} className="bg-[#F0FDFB] text-[#2EC4B6] text-xs font-medium px-2.5 py-1 rounded-full border border-[#2EC4B6]/20">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="mb-8">
          <h3 className="text-lg font-heading font-bold text-[#212529] mb-3">Sobre {guide.name.split(' ')[0]}</h3>
          <p className="text-[#6C757D] text-sm leading-relaxed mb-4">
            {guide.description}
          </p>
          
          <div className="bg-white p-4 rounded-2xl border border-[#E9ECEF]">
            <h4 className="text-sm font-bold text-[#212529] mb-2">Idiomas</h4>
            <div className="flex flex-wrap gap-2">
              {guide.languages.map((lang, idx) => (
                <span key={idx} className="bg-[#F8F9FA] text-[#495057] text-xs px-3 py-1.5 rounded-full border border-[#E9ECEF]">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Excursions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-bold text-[#212529]">Excursões Publicadas</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {MOCK_EXCURSIONS.slice(0, 3).map((excursion) => (
              <div 
                key={excursion.id}
                onClick={() => navigate(`/excursion/${excursion.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E9ECEF] flex cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-1/3 h-28">
                  <img src={excursion.imageUrl} alt={excursion.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-2/3 p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[#212529] text-sm line-clamp-2 mb-1">{excursion.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-[#6C757D]">
                      <Star size={12} className="text-[#FF6B35] fill-[#FF6B35]" />
                      <span>{excursion.rating} ({excursion.reviewsCount})</span>
                    </div>
                  </div>
                  <div className="font-bold text-[#2EC4B6] text-sm">
                    {excursion.price} {excursion.currency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-bold text-[#212529]">Avaliações</h3>
            <button className="text-sm font-bold text-[#0D6EFD] hover:underline">Ver todas</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#E9ECEF]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E9ECEF] flex items-center justify-center text-[#6C757D] font-bold text-xs">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#212529] text-sm">{review.author}</h4>
                      <span className="text-[#6C757D] text-[10px]">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < review.rating ? "text-[#FF6B35] fill-[#FF6B35]" : "text-[#E9ECEF] fill-[#E9ECEF]"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[#6C757D] text-sm leading-relaxed">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Contact Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-[#E9ECEF] z-20 pb-safe">
        <button 
          onClick={handleContact}
          disabled={isBooking}
          className="w-full bg-[#212529] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#343A40] transition-colors disabled:opacity-70"
        >
          {isBooking ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <MessageCircle size={20} />
              Contactar Guia
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
