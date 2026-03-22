import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/ui/AuthModal';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: any;
  unreadCount?: Record<string, number>;
  excursionId?: string;
  excursionTitle?: string;
  participantDetails?: Record<string, {
    displayName: string;
    photoURL: string;
  }>;
}

export function MessagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!user);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      setChats(fetchedChats);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chats:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F9FA] pb-24">
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          title="Inicie sessão para conversar"
          description="Crie uma conta para falar diretamente com os guias locais e planear a sua próxima aventura."
        />
        <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm">
          <h1 className="text-2xl font-heading font-bold text-[#212529] mb-4">Mensagens</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-5">
          <div className="w-20 h-20 bg-[#E9ECEF] rounded-full flex items-center justify-center mb-4">
            <MessageCircle size={32} className="text-[#ADB5BD]" />
          </div>
          <h2 className="text-xl font-heading font-bold text-[#212529] mb-2">Sem mensagens</h2>
          <p className="text-[#6C757D] text-sm max-w-xs mx-auto mb-6">
            Inicie sessão para ver as suas conversas com os guias locais.
          </p>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-[#212529] text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-colors"
          >
            Entrar / Criar Conta
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#F8F9FA] pb-24"
    >
      {/* Header */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-heading font-bold text-[#212529] mb-4">Mensagens</h1>
      </header>

      {/* Message List */}
      <div className="px-5 pt-6 flex-1">
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#E9ECEF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#6C757D]">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-lg font-heading font-semibold text-[#212529] mb-2">Sem mensagens</h3>
              <p className="text-[#6C757D] text-sm">As suas conversas com os guias aparecerão aqui.</p>
            </div>
          ) : (
            chats.map(chat => (
              <ChatCard key={chat.id} chat={chat} currentUserId={user.uid} />
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ChatCard({ chat, currentUserId }: { chat: Chat, currentUserId: string }) {
  const otherParticipantId = chat.participants.find(id => id !== currentUserId);
  const otherDetails = otherParticipantId && chat.participantDetails 
    ? chat.participantDetails[otherParticipantId] 
    : null;
    
  const unreadCount = chat.unreadCount?.[currentUserId] || 0;

  return (
    <Link to={`/chat/${chat.id}`} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#E9ECEF] hover:shadow-md transition-all group">
      <div className="relative">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-[#F8F9FA] shrink-0 border-2 border-transparent group-hover:border-[#2EC4B6] transition-colors">
          {otherDetails?.photoURL ? (
            <img src={otherDetails.photoURL} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
          )}
        </div>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">{unreadCount}</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-heading font-bold text-[#212529] text-base truncate pr-2 flex items-center gap-1">
            {otherDetails?.displayName || 'Utilizador'}
          </h3>
          <span className="text-[#6C757D] text-xs whitespace-nowrap shrink-0">
            {chat.lastMessageTime?.toDate ? chat.lastMessageTime.toDate().toLocaleDateString() : ''}
          </span>
        </div>
        
        <p className="text-[#2EC4B6] text-xs font-semibold mb-1 truncate">
          {chat.excursionTitle || 'Conversa'}
        </p>
        
        <p className={`text-sm truncate ${unreadCount > 0 ? 'text-[#212529] font-semibold' : 'text-[#6C757D]'}`}>
          {chat.lastMessage || 'Nova conversa iniciada'}
        </p>
      </div>
      
      <div className="text-[#ADB5BD] group-hover:text-[#2EC4B6] transition-colors shrink-0">
        <ChevronRight size={20} />
      </div>
    </Link>
  );
}
