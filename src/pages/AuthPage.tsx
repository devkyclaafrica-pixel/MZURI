import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword
} from 'firebase/auth';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { updateProfile, setGuestMode } = useAuth();
  const [shouldNavigateHome, setShouldNavigateHome] = useState(false);

  useEffect(() => {
    if (shouldNavigateHome) {
      navigate('/');
    }
  }, [shouldNavigateHome, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setShouldNavigateHome(true);
      } else {
        // Normal Explorer Registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile({
          displayName: name,
          role: 'explorer',
          onboardingCompleted: true
        });
        setShouldNavigateHome(true);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      setShouldNavigateHome(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar com Google.');
    } finally {
      setLoading(false);
    }
  };

  const skipToGuest = () => {
    setGuestMode(true);
    setShouldNavigateHome(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2EC4B6]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFD166]/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-bold text-[#212529] mb-2">MZURI</h1>
          <p className="text-[#6C757D] text-lg">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie a sua conta'}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] shadow-sm border border-[#E9ECEF]"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            {!isLogin && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <label className="block text-sm font-semibold text-[#212529] mb-2">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="João Silva"
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#212529] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#212529] mb-2">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADB5BD]" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl focus:outline-none focus:border-[#2EC4B6] focus:ring-1 focus:ring-[#2EC4B6] transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#212529] text-white py-4 rounded-2xl font-bold text-lg mt-2 hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-x-0 h-px bg-[#E9ECEF]" />
              <span className="relative bg-white px-4 text-sm text-[#ADB5BD] font-medium">ou continue com</span>
            </div>

            <button 
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white border border-[#E9ECEF] text-[#212529] py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-[#F8F9FA] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </motion.div>

        <div className="mt-8 text-center flex flex-col gap-4">
          <p className="text-[#6C757D] text-sm">
            {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-[#2EC4B6] font-bold hover:underline"
            >
              {isLogin ? 'Registe-se' : 'Faça Login'}
            </button>
          </p>
          
          <button 
            onClick={skipToGuest}
            className="text-[#ADB5BD] text-sm font-medium hover:text-[#212529] transition-colors"
          >
            Explorar como visitante
          </button>
        </div>
      </div>
    </div>
  );
}
