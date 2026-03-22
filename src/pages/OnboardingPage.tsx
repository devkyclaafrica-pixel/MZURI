import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Compass, Users, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const slides = [
  {
    id: 1,
    title: "Descubra o Autêntico",
    description: "Explore os recantos mais deslumbrantes de Moçambique com guias locais que conhecem cada segredo.",
    icon: <Map size={48} className="text-[#2EC4B6]" />,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Experiências Únicas",
    description: "Desde safaris emocionantes a praias paradisíacas, encontre a aventura perfeita para si.",
    icon: <Compass size={48} className="text-[#FFD166]" />,
    image: "https://images.unsplash.com/photo-1547471080-7cb2cb6a5a36?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Comunidade Local",
    description: "Conecte-se com guias certificados e apoie o turismo sustentável em cada viagem.",
    icon: <Users size={48} className="text-[#FF6B35]" />,
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1000&auto=format&fit=crop"
  }
];

export function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { setGuestMode } = useAuth();

  const [shouldNavigateAuth, setShouldNavigateAuth] = useState(false);
  const [shouldNavigateHome, setShouldNavigateHome] = useState(false);

  useEffect(() => {
    if (shouldNavigateAuth) {
      navigate('/auth');
    }
  }, [shouldNavigateAuth, navigate]);

  useEffect(() => {
    if (shouldNavigateHome) {
      navigate('/');
    }
  }, [shouldNavigateHome, navigate]);

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      setShouldNavigateAuth(true);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const skipOnboarding = () => {
    setGuestMode(true);
    setShouldNavigateHome(true);
  };

  return (
    <div className="relative h-screen w-full bg-[#141414] overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide}
          src={slides[currentSlide].image}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90" />

      <div className="relative z-10 flex-1 flex flex-col justify-between p-6">
        <div className="flex justify-end pt-8">
          <button 
            onClick={skipOnboarding}
            className="text-white/70 text-sm font-medium hover:text-white transition-colors"
          >
            Saltar
          </button>
        </div>

        <div className="pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                {slides[currentSlide].icon}
              </div>
              
              <div>
                <h1 className="text-4xl font-heading font-bold text-white mb-4 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-white/80 text-lg leading-relaxed max-w-sm">
                  {slides[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12">
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-[#2EC4B6]' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={nextSlide}
              className="w-14 h-14 rounded-full bg-[#2EC4B6] flex items-center justify-center text-white hover:bg-[#25a89c] transition-colors shadow-lg"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
