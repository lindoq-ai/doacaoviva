import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, sendEmailVerification, reload } from 'firebase/auth';
import { auth, db, handleFirestoreError } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface UserProfile {
  name: string;
  role: 'donor' | 'recipient';
  joinedAt: any;
  bio?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  sendVerification: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const sendVerification = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  const refreshUser = async () => {
    if (user) {
      await reload(user);
      setUser({ ...auth.currentUser } as User);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await setDoc(docRef, { ...docSnap.data(), ...data }, { merge: true });
      } else {
        const newProfile = {
          name: user.displayName || 'Usuário',
          role: 'donor' as const,
          joinedAt: serverTimestamp(),
          ...data
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile as UserProfile);
      }

      // Refresh profile in state
      const updatedSnap = await getDoc(docRef);
      if (updatedSnap.exists()) {
        setProfile(updatedSnap.data() as UserProfile);
      }
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout, updateProfile, sendVerification, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
