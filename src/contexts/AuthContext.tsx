import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export type UserRole = 'explorer' | 'guide' | 'agency' | 'organizer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  phoneNumber?: string;
  onboardingCompleted?: boolean;
  createdAt: any;
  // Guide specific fields
  bio?: string;
  languages?: string[];
  location?: string;
  hourlyRate?: number;
  // User specific fields
  favorites?: string[];
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  setGuestMode: (isGuest: boolean) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  toggleFavorite: (itemId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isGuest: false,
  setGuestMode: () => {},
  updateProfile: async () => {},
  toggleFavorite: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setIsGuest(false);
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create default profile for new users
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              role: 'explorer', // Default role
              createdAt: serverTimestamp(),
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setGuestMode = (guest: boolean) => {
    setIsGuest(guest);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, data, { merge: true });
      setProfile((prev) => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const toggleFavorite = async (itemId: string) => {
    if (!user || !profile) return;
    
    const currentFavorites = profile.favorites || [];
    const isFavorite = currentFavorites.includes(itemId);
    
    const newFavorites = isFavorite 
      ? currentFavorites.filter(id => id !== itemId)
      : [...currentFavorites, itemId];
      
    await updateProfile({ favorites: newFavorites });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isGuest, setGuestMode, updateProfile, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};
