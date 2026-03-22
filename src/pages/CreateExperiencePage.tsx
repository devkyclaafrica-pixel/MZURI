import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Upload, Clock, MapPin, DollarSign, Image as ImageIcon, Users, Tag } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function CreateExperiencePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    location: '',
    price: '',
    maxGroupSize: '',
    category: 'Gastronomia'
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role === 'explorer' || !profile?.role) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard'); // Navigate back to dashboard on success
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
        <h1 className="text-2xl font-heading font-bold text-[#212529]">Criar Experiência</h1>
      </header>

      <div className="px-5 pt-6 pb-24">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-[#212529] mb-2">
              Imagem de Capa *
            </label>
            <div className="w-full h-48 bg-white border-2 border-dashed border-[#E9ECEF] rounded-2xl flex flex-col items-center justify-center gap-3 text-[#6C757D] hover:bg-[#F8F9FA] transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-[#FFF9E6] flex items-center justify-center text-[#FFD166]">
                <ImageIcon size={24} />
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-[#212529] block">Clique para fazer upload</span>
                <span className="text-xs">PNG, JPG até 5MB</span>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E9ECEF] flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-[#212529] mb-2">
                Título da Experiência *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition-shadow"
                placeholder="Ex: Aula de Culinária Moçambicana"
              />
            </div>

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
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition-shadow appearance-none"
                >
                  <option value="Gastronomia">Gastronomia</option>
                  <option value="Cultura">Cultura & Arte</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Bem-estar">Bem-estar</option>
                  <option value="Artesanato">Artesanato</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#212529] mb-2">
                Descrição *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition-shadow min-h-[120px] resize-none"
                placeholder="Descreva o que os participantes vão experienciar..."
              />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E9ECEF] flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#212529] mb-2">
                  Duração *
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition-shadow"
                    placeholder="Ex: 2 horas"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#212529] mb-2">
                  Tamanho do Grupo *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.maxGroupSize}
                    onChange={(e) => setFormData({...formData, maxGroupSize: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition-shadow"
                    placeholder="Máx. pessoas"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#212529] mb-2">
                Ponto de Encontro *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition-shadow"
                  placeholder="Ex: Mercado Central, Maputo"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E9ECEF] flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-[#212529] mb-2">
                Preço por Pessoa (MZN) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition-shadow"
                  placeholder="0 para grátis"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD166] text-[#212529] font-bold py-4 rounded-2xl mt-2 hover:bg-[#f5c75b] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? 'A criar experiência...' : 'Publicar Experiência'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
