import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, MapPin, Image as ImageIcon, Tag, Lightbulb, FileText, Navigation } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function SuggestPlacePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: 'Restaurante',
    description: '',
    tips: ''
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Obrigado pela sua sugestão! A nossa equipa irá analisá-la em breve.');
      navigate('/profile'); // Navigate back to profile on success
    }, 1500);
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
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-heading font-bold text-[#212529]">Sugerir lugar</h1>
      </header>

      <div className="px-5 pt-6 pb-24">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Photos Upload */}
          <div>
            <label className="block text-sm font-bold text-[#212529] mb-2">
              Fotos *
            </label>
            <div className="w-full h-32 bg-white border-2 border-dashed border-[#E9ECEF] rounded-2xl flex flex-col items-center justify-center gap-2 text-[#6C757D] hover:bg-[#F8F9FA] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#E7F1FF] flex items-center justify-center text-[#0D6EFD]">
                <ImageIcon size={20} />
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-[#212529] block">Adicionar fotos</span>
                <span className="text-xs">PNG, JPG</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E9ECEF] flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-[#212529] mb-2">
                Nome do local *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] transition-shadow"
                placeholder="Ex: Restaurante Costa do Sol"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-[#212529] mb-2">
                Categoria *
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] transition-shadow appearance-none"
                >
                  <option value="Restaurante">Restaurante</option>
                  <option value="Praia">Praia</option>
                  <option value="Miradouro">Miradouro</option>
                  <option value="Monumento">Monumento Histórico</option>
                  <option value="Natureza">Natureza & Parque</option>
                  <option value="Bar">Bar & Vida Noturna</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-[#212529] mb-2">
                Localização (Mapa) *
              </label>
              <div className="relative mb-2">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] transition-shadow"
                  placeholder="Pesquisar endereço..."
                />
              </div>
              {/* Fake Map Area */}
              <div className="w-full h-32 bg-[#E9ECEF] rounded-xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#ADB5BD 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                <div className="flex flex-col items-center text-[#6C757D] z-10">
                  <Navigation size={24} className="mb-1" />
                  <span className="text-xs font-bold">Toque para marcar no mapa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E9ECEF] flex flex-col gap-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-[#212529] mb-2">
                Descrição *
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-[#ADB5BD]" size={20} />
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] transition-shadow min-h-[100px] resize-none"
                  placeholder="O que faz este lugar ser especial?"
                />
              </div>
            </div>

            {/* Tips */}
            <div>
              <label className="block text-sm font-bold text-[#212529] mb-2">
                Dicas (Opcional)
              </label>
              <div className="relative">
                <Lightbulb className="absolute left-4 top-4 text-[#ADB5BD]" size={20} />
                <textarea
                  value={formData.tips}
                  onChange={(e) => setFormData({...formData, tips: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] transition-shadow min-h-[100px] resize-none"
                  placeholder="Ex: Melhor ir ao pôr do sol, pedir o prato X..."
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#212529] text-white font-bold py-4 rounded-2xl mt-2 hover:bg-black transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Enviar sugestão'
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
