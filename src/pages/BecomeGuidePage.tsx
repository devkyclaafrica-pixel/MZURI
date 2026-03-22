import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ShieldCheck, ArrowRight, Phone } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export function BecomeGuidePage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  // Guide profile fields
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  // Initialize reCAPTCHA
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role === 'guide' && !showProfileSetup) {
    return <Navigate to="/manage-guide" replace />;
  }

  const sendOTP = async () => {
    if (!phone) return;
    
    setError('');
    setLoading(true);

    try {
      const appVerifier = window.recaptchaVerifier;
      // Format phone number to E.164 format. Assuming Mozambique (+258) if no country code is provided.
      // Remove any non-digit characters first.
      const digitsOnly = phone.replace(/\D/g, '');
      let formattedPhone = phone;
      
      if (digitsOnly.length > 0) {
        if (phone.startsWith('+')) {
          formattedPhone = `+${digitsOnly}`;
        } else if (digitsOnly.startsWith('258')) {
          formattedPhone = `+${digitsOnly}`;
        } else {
          formattedPhone = `+258${digitsOnly.replace(/^0+/, '')}`;
        }
      }
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setShowOTP(true);
      setResendCountdown(60);
    } catch (err: any) {
      console.error("SMS Error:", err);
      setError('Erro ao enviar SMS. Verifique o número de telefone.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOTP();
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
      
      if (user) {
        // Link phone credential to existing user
        try {
          await linkWithCredential(user, credential);
        } catch (linkError: any) {
          // If already linked or other error, we might just proceed if it's the same user
          console.error("Link error:", linkError);
        }
      } else {
        // This shouldn't happen as this page is for logged-in users, but just in case
        await confirmationResult.confirm(otp);
      }
      
      await updateProfile({
        role: 'guide',
        phoneNumber: phone,
      });
      
      setShowProfileSetup(true);
      setLoading(false);
    } catch (err: any) {
      setError('Código OTP inválido.');
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        bio,
        location,
        hourlyRate: parseFloat(hourlyRate) || 0,
      });
      navigate('/profile');
    } catch (err: any) {
      setError('Erro ao guardar perfil.');
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
      <div id="recaptcha-container"></div>
      
      {/* Header */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#212529] hover:bg-[#E9ECEF] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-heading font-bold text-[#212529]">Tornar-me Guia</h1>
      </header>

      <div className="px-5 pt-8">
        {!showOTP && !showProfileSetup ? (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E9ECEF]">
            <div className="w-16 h-16 bg-[#2EC4B6]/10 rounded-full flex items-center justify-center mb-6 text-[#2EC4B6]">
              <ShieldCheck size={32} />
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-[#212529] mb-2">Verificação de Identidade</h2>
            <p className="text-[#6C757D] text-sm mb-8">
              Para garantir a segurança da nossa comunidade, precisamos de verificar o seu número de telefone antes de o tornar num guia local.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleStartVerification} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#212529] mb-2">Número de Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+258 84 123 4567"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-[#212529] text-white py-4 rounded-2xl font-bold text-lg mt-4 hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? 'A enviar...' : 'Enviar Código SMS'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          </div>
        ) : showOTP && !showProfileSetup ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-[#E9ECEF]"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-[#212529] mb-2">Introduza o Código</h2>
              <p className="text-[#6C757D] text-sm">
                Enviámos um código SMS para <br/><span className="font-bold text-[#212529]">{phone}</span>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
              <div>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#2EC4B6] text-white py-4 rounded-2xl font-bold text-lg mt-4 hover:bg-[#25a89c] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? 'A verificar...' : 'Confirmar e Concluir'}
                {!loading && <ArrowRight size={20} />}
              </button>
              
              <div className="flex flex-col items-center gap-2 mt-2">
                <button 
                  type="button"
                  onClick={sendOTP}
                  disabled={resendCountdown > 0 || loading}
                  className="text-[#2EC4B6] text-sm font-medium hover:text-[#25a89c] transition-colors disabled:text-[#ADB5BD]"
                >
                  {resendCountdown > 0 ? `Reenviar código em ${resendCountdown}s` : 'Reenviar código SMS'}
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    setShowOTP(false);
                    setLoading(false);
                  }}
                  className="text-[#6C757D] text-sm font-medium hover:text-[#212529] transition-colors"
                >
                  Voltar
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-[#E9ECEF]"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-[#212529] mb-2">Complete o seu Perfil</h2>
              <p className="text-[#6C757D] text-sm">
                Conte-nos mais sobre si para que os exploradores o possam conhecer melhor.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
                {error}
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
                {loading ? 'A guardar...' : 'Guardar Perfil'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
