import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, User, Briefcase, Building, Calendar, Upload, CheckCircle } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function BecomePartnerPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'guide' | 'agency' | 'organizer' | ''>('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    whatsapp: '',
    socialMedia: '',
    // Dynamic fields
    languages: '',
    specialties: '',
    nuit: '',
    website: '',
    eventTypes: ''
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleTypeSelect = (type: 'guide' | 'agency' | 'organizer') => {
    setSelectedType(type);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally save the application to a 'partner_applications' collection
    // and wait for admin approval. For demo purposes, we'll just update the user's role 
    // to the selected type to unlock the partner features immediately.
    
    await updateProfile({ 
      role: selectedType as any,
    });
    
    setStep(3);
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'guide': return 'Guia Local';
      case 'agency': return 'Agência de Viagens';
      case 'organizer': return 'Organizador de Eventos';
      default: return 'Parceiro';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#F8F9FA]"
    >
      {/* Top Bar */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => step === 2 ? setStep(1) : navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-heading font-bold text-[#212529]">
          {step === 1 ? 'Tornar-se parceiro' : 'Registo Profissional'}
        </h1>
      </header>

      <div className="px-5 pt-6 pb-24">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="mb-4">
              <h2 className="text-xl font-heading font-bold text-[#212529] mb-2">Escolha o seu perfil</h2>
              <p className="text-[#6C757D] text-sm">
                Selecione como pretende utilizar a plataforma MZURI.
              </p>
            </div>

            <button 
              onClick={() => handleTypeSelect('guide')}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#E9ECEF] shadow-sm hover:border-[#2EC4B6] transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-full bg-[#E8F8F5] flex items-center justify-center shrink-0">
                <Briefcase size={24} className="text-[#2EC4B6]" />
              </div>
              <div>
                <h3 className="font-bold text-[#212529]">Guia Local</h3>
                <p className="text-sm text-[#6C757D]">Criar e gerir excursões e experiências locais.</p>
              </div>
            </button>

            <button 
              onClick={() => handleTypeSelect('agency')}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#E9ECEF] shadow-sm hover:border-[#FF6B35] transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFF0EB] flex items-center justify-center shrink-0">
                <Building size={24} className="text-[#FF6B35]" />
              </div>
              <div>
                <h3 className="font-bold text-[#212529]">Agência</h3>
                <p className="text-sm text-[#6C757D]">Gerir múltiplos guias e pacotes turísticos completos.</p>
              </div>
            </button>

            <button 
              onClick={() => handleTypeSelect('organizer')}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#E9ECEF] shadow-sm hover:border-[#0D6EFD] transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-full bg-[#E7F1FF] flex items-center justify-center shrink-0">
                <Calendar size={24} className="text-[#0D6EFD]" />
              </div>
              <div>
                <h3 className="font-bold text-[#212529]">Organizador de eventos</h3>
                <p className="text-sm text-[#6C757D]">Criar, promover e vender bilhetes para eventos.</p>
              </div>
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-6">
              <span className="inline-block bg-[#E9ECEF] text-[#495057] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                Candidatura para {getTypeLabel(selectedType)}
              </span>
              <p className="text-[#6C757D] text-sm">
                Preencha os dados abaixo para submeter a sua candidatura profissional.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-[#212529] mb-2">
                  {selectedType === 'guide' ? 'Nome Completo *' : 
                   selectedType === 'agency' ? 'Nome da Agência *' : 
                   'Nome do Organizador / Empresa *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow"
                  placeholder={selectedType === 'guide' ? "O seu nome completo" : "Nome da empresa"}
                />
              </div>

              {selectedType === 'guide' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-[#212529] mb-2">
                      Idiomas Falados *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.languages}
                      onChange={(e) => setFormData({...formData, languages: e.target.value})}
                      className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow"
                      placeholder="Ex: Português, Inglês, Espanhol"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#212529] mb-2">
                      Especialidades *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specialties}
                      onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                      className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow"
                      placeholder="Ex: História, Natureza, Gastronomia"
                    />
                  </div>
                </>
              )}

              {selectedType === 'agency' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-[#212529] mb-2">
                      NUIT / Alvará *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nuit}
                      onChange={(e) => setFormData({...formData, nuit: e.target.value})}
                      className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow"
                      placeholder="Número de registo da empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#212529] mb-2">
                      Website (Opcional)
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              {selectedType === 'organizer' && (
                <div>
                  <label className="block text-sm font-bold text-[#212529] mb-2">
                    Tipos de Eventos *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.eventTypes}
                    onChange={(e) => setFormData({...formData, eventTypes: e.target.value})}
                    className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow"
                    placeholder="Ex: Festivais, Workshops, Retiros"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[#212529] mb-2">
                  Descrição *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow min-h-[120px] resize-none"
                  placeholder="Fale-nos um pouco sobre a sua experiência e o que oferece..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#212529] mb-2">
                  Localização *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow"
                  placeholder="Cidade, Província"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#212529] mb-2">
                  Contacto (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow"
                  placeholder="+258 8X XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#212529] mb-2">
                  Redes Sociais (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.socialMedia}
                  onChange={(e) => setFormData({...formData, socialMedia: e.target.value})}
                  className="w-full p-4 bg-white border border-[#E9ECEF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] transition-shadow"
                  placeholder="Link para Instagram, Facebook, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#212529] mb-2">
                  Upload de Documentos (Opcional)
                </label>
                <div className="w-full p-6 bg-white border-2 border-dashed border-[#E9ECEF] rounded-2xl flex flex-col items-center justify-center gap-2 text-[#6C757D] hover:bg-[#F8F9FA] transition-colors cursor-pointer">
                  <Upload size={24} />
                  <span className="text-sm text-center">Clique para fazer upload de licenças ou identificação</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#212529] text-white font-bold py-4 rounded-2xl mt-4 hover:bg-[#343A40] transition-colors shadow-sm"
              >
                Submeter candidatura
              </button>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12"
          >
            <div className="w-20 h-20 bg-[#E8F8F5] rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-[#2EC4B6]" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-[#212529] mb-2">
              Candidatura Submetida!
            </h2>
            <p className="text-[#6C757D] mb-8 max-w-xs">
              A sua candidatura para {getTypeLabel(selectedType)} foi recebida com sucesso. A nossa equipa irá analisar e entrar em contacto em breve.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-[#2EC4B6] text-white font-bold py-4 rounded-2xl hover:bg-[#25a89c] transition-colors shadow-sm"
            >
              Voltar ao Perfil
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
