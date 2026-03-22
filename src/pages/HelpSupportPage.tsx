import { motion } from 'motion/react';
import { ChevronLeft, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HelpSupportPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-[#F8F9FA] min-h-screen pb-24"
    >
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-heading font-bold text-[#212529]">Ajuda e Suporte</h1>
      </header>

      <div className="px-5 pt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] overflow-hidden mb-6">
          <SettingOption icon={<HelpCircle size={20} className="text-[#2EC4B6]" />} label="Perguntas Frequentes (FAQ)" />
          <div className="h-px bg-[#E9ECEF] mx-4" />
          <SettingOption icon={<MessageCircle size={20} className="text-[#FF6B35]" />} label="Chat de Suporte" />
          <div className="h-px bg-[#E9ECEF] mx-4" />
          <SettingOption icon={<Mail size={20} className="text-[#0D6EFD]" />} label="Enviar Email" />
          <div className="h-px bg-[#E9ECEF] mx-4" />
          <SettingOption icon={<Phone size={20} className="text-[#6C757D]" />} label="Linha de Apoio" />
        </div>
      </div>
    </motion.div>
  );
}

function SettingOption({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-sm text-[#212529]">{label}</span>
      </div>
      <ChevronLeft size={16} className="text-[#6C757D] rotate-180" />
    </button>
  );
}
