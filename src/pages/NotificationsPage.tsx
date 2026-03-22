import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Bell, Calendar, MessageCircle, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'Nova mensagem',
      description: 'João enviou-lhe uma mensagem sobre a excursão.',
      time: 'Há 5 min',
      read: false,
      icon: <MessageCircle size={20} className="text-[#0D6EFD]" />,
      link: '/messages'
    },
    {
      id: 2,
      type: 'booking',
      title: 'Reserva confirmada',
      description: 'A sua reserva para "Passeio de Barco" foi confirmada.',
      time: 'Há 2 horas',
      read: false,
      icon: <Calendar size={20} className="text-[#2EC4B6]" />,
      link: '/profile'
    },
    {
      id: 3,
      type: 'review',
      title: 'Nova avaliação',
      description: 'Maria deixou uma avaliação de 5 estrelas.',
      time: 'Ontem',
      read: true,
      icon: <Star size={20} className="text-[#FF6B35]" />,
      link: '/profile'
    }
  ]);

  const handleNotificationClick = (id: number, link: string) => {
    // Marcar como lida
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
    // Redirecionar
    navigate(link);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-[#F8F9FA] min-h-screen pb-24"
    >
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-heading font-bold text-[#212529]">Notificações</h1>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="text-[#2EC4B6] text-sm font-medium hover:underline flex items-center gap-1"
          >
            <CheckCircle2 size={16} />
            Lidas
          </button>
        )}
      </header>

      <div className="px-5 pt-6">
        <div className="flex flex-col gap-4">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-[#6C757D]">
              <Bell size={48} className="mx-auto mb-4 opacity-20" />
              <p>Não tem notificações no momento.</p>
            </div>
          ) : (
            notifications.map(notification => (
              <button 
                key={notification.id} 
                onClick={() => handleNotificationClick(notification.id, notification.link)}
                className={`w-full text-left bg-white p-4 rounded-2xl shadow-sm border transition-all ${notification.read ? 'border-[#E9ECEF]' : 'border-[#2EC4B6] bg-[#F0FDFB]'} flex gap-4 items-start active:scale-[0.98]`}
              >
                <div className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center shrink-0">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm ${notification.read ? 'font-medium text-[#212529]' : 'font-bold text-[#212529]'}`}>{notification.title}</h3>
                    <span className="text-[#6C757D] text-xs">{notification.time}</span>
                  </div>
                  <p className="text-[#6C757D] text-sm leading-snug">{notification.description}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-[#2EC4B6] mt-1.5 shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
