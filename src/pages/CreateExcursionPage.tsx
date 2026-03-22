import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Image as ImageIcon, MapPin, Clock, DollarSign, Tag, AlignLeft, Calendar as CalendarIcon, Users, Upload, X, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function CreateExcursionPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [category, setCategory] = useState('Aventura');
  const [mediaFiles, setMediaFiles] = useState<{url: string, type: 'image' | 'video'}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || profile?.role !== 'guide') {
      navigate('/profile');
    }
  }, [user, profile, navigate]);

  if (!user || profile?.role !== 'guide') {
    return null;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await addDoc(collection(db, 'excursions'), {
        guideId: user.uid,
        guideName: profile?.displayName || 'Guia Local',
        guideAvatar: profile?.photoURL || '',
        title,
        description,
        location,
        locationId: 'custom', // Simplified for prototype
        price: parseFloat(price) || 0,
        currency: 'MZN',
        duration,
        date,
        capacity: parseInt(capacity) || 1,
        imageUrl: mediaFiles.length > 0 ? mediaFiles[0].url : 'https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?auto=format&fit=crop&q=80',
        mediaFiles,
        category,
        rating: 5.0, // Default for new
        reviewsCount: 0,
        createdAt: serverTimestamp()
      });
      
      navigate('/manage-excursions');
    } catch (err: any) {
      console.error("Error creating excursion:", err);
      setError('Erro ao criar experiência. Tente novamente.');
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Em um app real, faríamos upload para o Storage.
      // Aqui vamos criar URLs locais para preview.
      const newFiles = Array.from(e.target.files).map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
      }));
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-[#F8F9FA] min-h-screen pb-24"
    >
      {/* Header */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-heading font-bold text-[#212529]">Nova Experiência</h1>
      </header>

      <div className="px-5 pt-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E9ECEF]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#212529] mb-2 flex items-center gap-2">
                <Tag size={16} className="text-[#2EC4B6]" /> Título da Experiência
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Safari Fotográfico no Kruger"
                className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#212529] mb-2 flex items-center gap-2">
                <AlignLeft size={16} className="text-[#2EC4B6]" /> Descrição
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que os exploradores vão viver..."
                className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all min-h-[120px] resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#212529] mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-[#2EC4B6]" /> Localização
                </label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Maputo"
                  className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#212529] mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-[#2EC4B6]" /> Duração
                </label>
                <input 
                  type="text" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 4 horas"
                  className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#212529] mb-2 flex items-center gap-2">
                  <CalendarIcon size={16} className="text-[#2EC4B6]" /> Data
                </label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#212529] mb-2 flex items-center gap-2">
                  <Users size={16} className="text-[#2EC4B6]" /> Vagas
                </label>
                <input 
                  type="number" 
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Ex: 10"
                  min="1"
                  className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#212529] mb-2 flex items-center gap-2">
                  <DollarSign size={16} className="text-[#2EC4B6]" /> Preço (MZN)
                </label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 2500"
                  className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#212529] mb-2 flex items-center gap-2">
                  <Tag size={16} className="text-[#2EC4B6]" /> Categoria
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all appearance-none"
                >
                  <option value="Aventura">Aventura</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Natureza">Natureza</option>
                  <option value="Gastronomia">Gastronomia</option>
                  <option value="História">História</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#212529] mb-2 flex items-center gap-2">
                <ImageIcon size={16} className="text-[#2EC4B6]" /> Imagens e Vídeos
              </label>
              
              <div className="flex flex-wrap gap-3 mb-3">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E9ECEF]">
                    {file.type === 'image' ? (
                      <img src={file.url} alt={`Media ${index}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center relative">
                        <video src={file.url} className="w-full h-full object-cover opacity-70" />
                        <Video size={24} className="text-white absolute" />
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-[#E9ECEF] flex flex-col items-center justify-center text-[#6C757D] hover:bg-[#F8F9FA] hover:border-[#2EC4B6] hover:text-[#2EC4B6] transition-all"
                >
                  <Upload size={24} className="mb-1" />
                  <span className="text-xs font-medium">Adicionar</span>
                </button>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                multiple
                className="hidden"
              />
              <p className="text-xs text-[#6C757D]">Adicione fotos ou vídeos para mostrar o que os exploradores vão viver.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#212529] text-white font-bold py-4 rounded-2xl mt-4 hover:bg-black transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Publicar'
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
