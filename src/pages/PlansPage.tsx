import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Check, Star, Zap, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PlansPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'Grátis',
      yearlyPrice: 'Grátis',
      period: 'para sempre',
      yearlyPeriod: 'para sempre',
      description: 'O essencial para começar a partilhar as suas experiências locais.',
      features: [
        'Até 3 excursões ativas',
        'Perfil de guia básico',
        'Suporte por email',
        'Taxa de serviço de 15%'
      ],
      icon: <Star className="text-[#6C757D]" size={20} />,
      iconBg: 'bg-[#F8F9FA]',
      buttonText: 'Plano Atual',
      buttonStyle: 'bg-[#F8F9FA] text-[#6C757D] border border-[#E9ECEF] cursor-not-allowed',
      cardStyle: 'bg-white border border-[#E9ECEF]',
      headerStyle: 'text-[#212529]',
      priceStyle: 'text-[#212529]',
      descStyle: 'text-[#6C757D]',
      checkStyle: 'text-[#ADB5BD]',
      featureStyle: 'text-[#495057]'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '1.500',
      yearlyPrice: '15.000',
      period: 'MT / mês',
      yearlyPeriod: 'MT / ano',
      description: 'Para guias profissionais que querem destacar-se e crescer.',
      features: [
        'Excursões ilimitadas',
        'Destaque nas pesquisas',
        'Perfil de guia verificado',
        'Suporte prioritário',
        'Taxa de serviço de 10%',
        'Estatísticas avançadas'
      ],
      icon: <Zap className="text-[#FFD166]" size={20} />,
      iconBg: 'bg-[#FFD166]/10',
      buttonText: 'Assinar Pro',
      buttonStyle: 'bg-[#FFD166] text-[#212529] hover:bg-[#f5c75b] shadow-lg shadow-[#FFD166]/20',
      cardStyle: 'bg-[#1A1D20] border border-[#2C3035] shadow-xl shadow-[#1A1D20]/10 relative overflow-hidden',
      headerStyle: 'text-white',
      priceStyle: 'text-white',
      descStyle: 'text-[#ADB5BD]',
      checkStyle: 'text-[#FFD166]',
      featureStyle: 'text-[#E9ECEF]',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '3.500',
      yearlyPrice: '35.000',
      period: 'MT / mês',
      yearlyPeriod: 'MT / ano',
      description: 'A solução completa e exclusiva para agências e guias de topo.',
      features: [
        'Tudo do plano Pro',
        'Destaque na página principal',
        'Gestor de conta dedicado',
        'Taxa de serviço de 5%',
        'Sessão fotográfica (1/ano)',
        'Acesso antecipado a novidades'
      ],
      icon: <Crown className="text-white" size={20} />,
      iconBg: 'bg-white/20',
      buttonText: 'Assinar Premium',
      buttonStyle: 'bg-white text-[#1a9b8f] hover:bg-gray-50 shadow-lg shadow-black/10',
      cardStyle: 'bg-gradient-to-br from-[#2EC4B6] to-[#1a9b8f] border border-transparent shadow-xl shadow-[#2EC4B6]/20',
      headerStyle: 'text-white',
      priceStyle: 'text-white',
      descStyle: 'text-white/80',
      checkStyle: 'text-white',
      featureStyle: 'text-white'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#F8F9FA] pb-24"
    >
      {/* Top Bar */}
      <header className="px-5 pt-12 pb-4 sticky top-0 z-20 bg-[#F8F9FA]/80 backdrop-blur-md flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#E9ECEF] flex items-center justify-center text-[#212529] hover:bg-[#F8F9FA] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      <div className="px-5 pt-2">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-[#E8F8F5] rounded-2xl mb-4">
            <Sparkles className="text-[#2EC4B6]" size={28} />
          </div>
          <h1 className="text-3xl font-heading font-black text-[#212529] mb-4 tracking-tight">
            Eleve o seu negócio <br/> ao próximo nível
          </h1>
          <p className="text-[#6C757D] text-sm max-w-[280px] mx-auto leading-relaxed">
            Escolha o plano ideal para aumentar a sua visibilidade e os seus ganhos no MZURI.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-full border border-[#E9ECEF] shadow-sm inline-flex relative">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative z-10 px-6 py-2.5 text-sm font-bold rounded-full transition-colors ${
                billingCycle === 'monthly' ? 'text-white' : 'text-[#6C757D] hover:text-[#212529]'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative z-10 px-6 py-2.5 text-sm font-bold rounded-full transition-colors flex items-center gap-2 ${
                billingCycle === 'yearly' ? 'text-white' : 'text-[#6C757D] hover:text-[#212529]'
              }`}
            >
              Anual
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                billingCycle === 'yearly' ? 'bg-white/20 text-white' : 'bg-[#E8F8F5] text-[#2EC4B6]'
              }`}>
                -20%
              </span>
            </button>
            {/* Animated Pill Background */}
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#212529] rounded-full z-0"
              initial={false}
              animate={{
                left: billingCycle === 'monthly' ? '4px' : 'calc(50% + 4px)',
                width: billingCycle === 'monthly' ? '100px' : '130px'
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </div>

        {/* Plans Cards */}
        <div className="flex flex-col gap-6">
          {plans.map((plan) => (
            <motion.div 
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-[2rem] p-7 ${plan.cardStyle}`}
            >
              {plan.popular && (
                <>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD166] opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-[#FFD166] to-[#FFB703] text-[#212529] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    Mais Popular
                  </div>
                </>
              )}
              
              <div className="flex flex-col gap-6 relative z-10">
                {/* Card Header */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${plan.iconBg}`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-heading font-black ${plan.headerStyle}`}>{plan.name}</h3>
                  </div>
                </div>
                
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={billingCycle === 'monthly' ? plan.price : plan.yearlyPrice}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`text-4xl font-black tracking-tight ${plan.priceStyle}`}
                      >
                        {billingCycle === 'monthly' ? plan.price : plan.yearlyPrice}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className={`text-sm font-medium mt-1 block ${plan.descStyle}`}>
                    {billingCycle === 'monthly' ? plan.period : plan.yearlyPeriod}
                  </span>
                </div>
                
                <p className={`text-sm leading-relaxed ${plan.descStyle}`}>
                  {plan.description}
                </p>
                
                <div className={`h-px w-full ${plan.id === 'basic' ? 'bg-[#E9ECEF]' : plan.id === 'pro' ? 'bg-[#2C3035]' : 'bg-white/20'}`} />
                
                {/* Features */}
                <ul className="flex flex-col gap-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <Check size={18} className={plan.checkStyle} />
                      </div>
                      <span className={`text-sm font-medium ${plan.featureStyle}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Action Button */}
                <button 
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all mt-2 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* FAQ Teaser or Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-[#6C757D] text-sm">
            Tem dúvidas sobre os planos? <br/>
            <button className="text-[#2EC4B6] font-bold mt-1 hover:underline">Contacte o nosso suporte</button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
