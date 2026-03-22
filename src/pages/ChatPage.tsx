import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Send, MoreVertical, Phone, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc,
  updateDoc,
  setDoc
} from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

interface ChatDetails {
  id: string;
  participants: string[];
  excursionTitle?: string;
  participantDetails?: Record<string, {
    displayName: string;
    photoURL: string;
  }>;
}

export function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !chatId) return;

    // Fetch chat details
    const fetchChatDetails = async () => {
      try {
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        if (chatDoc.exists()) {
          setChatDetails({ id: chatDoc.id, ...chatDoc.data() } as ChatDetails);
        } else {
          console.error("Chat not found");
          navigate('/messages');
        }
      } catch (error) {
        console.error("Error fetching chat details:", error);
      }
    };

    fetchChatDetails();

    // Listen for messages
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setLoading(false);
      
      // Mark as read (reset unread count for this user)
      updateDoc(doc(db, 'chats', chatId), {
        [`unreadCount.${user.uid}`]: 0
      }).catch(err => console.error("Error updating unread count:", err));
    });

    return () => unsubscribe();
  }, [chatId, user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatId || !chatDetails) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Add message
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        chatId,
        senderId: user.uid,
        text: messageText,
        createdAt: serverTimestamp()
      });

      // Update chat last message and unread counts
      const otherParticipants = chatDetails.participants.filter(id => id !== user.uid);
      const unreadUpdates: Record<string, any> = {};
      otherParticipants.forEach(id => {
        // We can't easily increment a nested map value in a single update without FieldValue.increment,
        // but since we are just prototyping, we'll just set it to 1 for now or fetch current.
        // For simplicity, let's just set it to 1.
        unreadUpdates[`unreadCount.${id}`] = 1; 
      });

      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: messageText,
        lastMessageTime: serverTimestamp(),
        ...unreadUpdates
      });

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!user) {
    return null; // Handled by AppRoutes or AuthModal
  }

  const otherParticipantId = chatDetails?.participants.find(id => id !== user.uid);
  const otherParticipantDetails = otherParticipantId && chatDetails?.participantDetails 
    ? chatDetails.participantDetails[otherParticipantId] 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-screen bg-[#F8F9FA]"
    >
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/messages')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#212529] hover:bg-[#F8F9FA] transition-colors -ml-2"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E9ECEF]">
              {otherParticipantDetails?.photoURL ? (
                <img src={otherParticipantDetails.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
              )}
            </div>
            <div>
              <h2 className="font-heading font-bold text-[#212529] leading-tight">
                {otherParticipantDetails?.displayName || 'Utilizador'}
              </h2>
              {chatDetails?.excursionTitle && (
                <p className="text-[#6C757D] text-xs truncate max-w-[150px]">
                  {chatDetails.excursionTitle}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#212529] hover:bg-[#F8F9FA] transition-colors">
            <Phone size={20} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#212529] hover:bg-[#F8F9FA] transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <MessageCircle size={48} className="mb-4 text-[#6C757D]" />
            <p className="text-[#212529] font-medium">Inicie a conversa!</p>
            <p className="text-[#6C757D] text-sm">Envie uma mensagem para começar a planear.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === user.uid;
            const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.senderId === user.uid);
            
            return (
              <div key={msg.id} className={`flex gap-2 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 self-end mb-1 bg-[#E9ECEF]">
                    {showAvatar && otherParticipantDetails?.photoURL ? (
                      <img src={otherParticipantDetails.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : showAvatar ? (
                      <div className="w-full h-full flex items-center justify-center text-xs">👤</div>
                    ) : null}
                  </div>
                )}
                
                <div className={`px-4 py-2.5 rounded-2xl ${
                  isMe 
                    ? 'bg-[#2EC4B6] text-white rounded-br-sm' 
                    : 'bg-white border border-[#E9ECEF] text-[#212529] rounded-bl-sm'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-[#ADB5BD]'}`}>
                    {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora'}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-[#E9ECEF]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escreva uma mensagem..."
            className="flex-1 bg-[#F8F9FA] border border-[#E9ECEF] rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 rounded-full bg-[#2EC4B6] text-white flex items-center justify-center hover:bg-[#25a89c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
