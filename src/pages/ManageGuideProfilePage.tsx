import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ManageGuideProfilePage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setHourlyRate(profile.hourlyRate ? profile.hourlyRate.toString() : '');
    }
  }, [profile]);

  if (!user || profile?.role !== 'guide') {
    return <Navigate to="/profile" replace />;
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateProfile({
        bio,
        location,
        hourlyRate: parseFloat(hourlyRate) || 0,
      });
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setError('Erro ao guardar perfil.');
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-xl font-heading font-bold text-[#212529]">Gerir Perfil de Guia</h1>
      </header>

      <div className="px-5 pt-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E9ECEF]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm rounded-2xl border border-green-100">
              {success}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#212529] mb-2">Sobre Mim</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Olá! Sou um guia local apaixonado por..."
                className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all min-h-[120px] resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#212529] mb-2">Localização Principal</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Maputo, Moçambique"
                className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#212529] mb-2">Preço por Hora (MZN)</label>
              <input 
                type="number" 
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="Ex: 500"
                min="0"
                step="50"
                className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !bio || !location || !hourlyRate}
              className="w-full bg-[#2EC4B6] text-white py-4 rounded-2xl font-bold text-lg mt-4 hover:bg-[#25a89c] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'A guardar...' : 'Guardar Alterações'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
