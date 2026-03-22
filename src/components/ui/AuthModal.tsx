import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  title = "Dê o próximo passo", 
  description = "Crie uma conta para guardar os seus favoritos, conversar com guias e muito mais." 
}: AuthModalProps) {
  const navigate = useNavigate();
  const { setGuestMode } = useAuth();

  const handleAuthRedirect = () => {
    setGuestMode(false);
    navigate('/auth');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-[32px] md:rounded-[32px] p-6 z-50 md:w-full md:max-w-md shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-[#F8F9FA] rounded-full flex items-center justify-center text-[#6C757D] hover:bg-[#E9ECEF] transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mt-4 mb-6 text-center">
              <div className="w-16 h-16 bg-[#2EC4B6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-[#212529] mb-2">{title}</h3>
              <p className="text-[#6C757D] text-sm leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAuthRedirect}
                className="w-full bg-[#212529] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                Criar Conta / Entrar
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={onClose}
                className="w-full bg-white border border-[#E9ECEF] text-[#6C757D] py-3.5 rounded-2xl font-semibold hover:bg-[#F8F9FA] transition-colors"
              >
                Agora não
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
