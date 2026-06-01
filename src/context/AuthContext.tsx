import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import type { AuthContextType, AuthSettings, UserData } from '../types/auth';

const defaultAuthSettings: AuthSettings = {
  allowNewAccountCreation: true,
  allowGoogleSignIn: true,
  pricingMode: 'free',
  premiumPrice: 299,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authSettings: defaultAuthSettings,
  login: async () => ({} as UserData),
  loginWithGoogle: async () => ({} as UserData),
  logout: async () => {},
  resetPassword: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authSettings, setAuthSettings] = useState<AuthSettings>(defaultAuthSettings);

  useEffect(() => {
    const settingsRef = doc(db, 'platformSettings', 'auth');
    const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
      const data = snapshot.data() as Partial<AuthSettings> | undefined;
      setAuthSettings({
        allowNewAccountCreation: data?.allowNewAccountCreation ?? true,
        allowGoogleSignIn: data?.allowGoogleSignIn ?? true,
        pricingMode: data?.pricingMode ?? 'free',
        premiumPrice: data?.premiumPrice ?? 299,
      });
    }, (error) => {
      console.error('Failed to read auth settings:', error);
      setAuthSettings(defaultAuthSettings);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Failed to set auth persistence', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If email is admin@freshhire.com, force admin role immediately to avoid missing doc issues
        if (firebaseUser.email === 'admin@freshhire.com') {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Admin User',
            role: 'admin'
          });
          setLoading(false);
          return;
        }

        // Check standard users first to see if soft-deleted/blocked
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && (userDoc.data() as any).isDeleted) {
          try {
            await firebaseUser.delete();
            await deleteDoc(doc(db, 'users', firebaseUser.uid)).catch(() => undefined);
          } catch (err) {
            console.error('Failed to delete soft-deleted auth user on auth state change:', err);
            await signOut(auth);
          }
          setUser(null);
          setLoading(false);
          return;
        }

        // Check if admin FIRST to prioritize admin rights if duplicate docs exist
        const adminDocRef = doc(db, 'admins', firebaseUser.uid);
        const adminDoc = await getDoc(adminDocRef);
        
        if (adminDoc.exists()) {
          const data = adminDoc.data() as any;
          data.role = 'admin';
          setUser(data as UserData);
        } else {
          // Check standard users
          if (userDoc.exists()) {
            const data = userDoc.data() as any;
            data.role = (data.role || 'user').toString().trim();
            setUser(data as UserData);
          } else {
            // Fallback if doc doesn't exist yet but user is authenticated
            const email = firebaseUser.email || '';
            const name = firebaseUser.displayName || email.split('@')[0] || 'User';
            const userData: UserData = {
              uid: firebaseUser.uid,
              email,
              name,
              role: 'user'
            };
            setUser(userData);
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), userData);
            } catch (e) {
              console.error('Failed to auto-create user document in auth state change:', e);
            }
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string, isSignUp?: boolean, customName?: string, branch?: string): Promise<UserData> => {
    if (!password) throw new Error('Password is required');

    if (isSignUp && !authSettings.allowNewAccountCreation) {
      throw new Error('New account creation is currently disabled by admin.');
    }
    
    let userCredential;
    if (isSignUp) {
      if (!customName || !branch) throw new Error('Name and branch are required for sign up');

      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const role = 'user';
      const name = customName.trim();
      
      const userData: UserData = {
        uid: userCredential.user.uid,
        email,
        name,
        role,
        branch: branch.trim()
      };

      // Create user document immediately
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      } catch (e) {
        console.error('Failed to create user document during sign up:', e);
      }

      return userData;
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Bypassing missing Firestore doc for admin@freshhire.com
      if (email === 'admin@freshhire.com') {
        const adminData: UserData = {
          uid: userCredential.user.uid,
          email: 'admin@freshhire.com',
          name: 'Admin User',
          role: 'admin'
        };
        setUser(adminData);
        return adminData;
      }

      // Ensure fast UI update on manual sign-in
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists() && (userDoc.data() as any).isDeleted) {
        try {
          await userCredential.user.delete();
          await deleteDoc(doc(db, 'users', userCredential.user.uid)).catch(() => undefined);
        } catch (err) {
          console.error('Failed to delete soft-deleted user during login:', err);
          await signOut(auth);
        }
        throw new Error('No account exist');
      }

      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data() as any;
        data.role = 'admin';
        setUser(data as UserData);
        return data as UserData;
      } else {
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUser(data);
          return data;
        } else {
          // If standard user doc doesn't exist, auto-create it
          const name = email.split('@')[0].split(/[\.\-_]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
          const userData: UserData = {
            uid: userCredential.user.uid,
            email,
            name,
            role: 'user'
          };
          try {
            await setDoc(doc(db, 'users', userCredential.user.uid), userData);
          } catch (e) {
            console.error('Failed to auto-create user document during login:', e);
          }
          setUser(userData);
          return userData;
        }
      }
    }
  };

  const loginWithGoogle = async (): Promise<UserData> => {
    if (!authSettings.allowGoogleSignIn) {
      throw new Error('Google sign-in is currently disabled by admin.');
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const email = result.user.email || '';
    
    // Check standard users first to see if soft-deleted/blocked
    const userDocRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && (userDoc.data() as any).isDeleted) {
      try {
        await result.user.delete();
        await deleteDoc(doc(db, 'users', result.user.uid)).catch(() => undefined);
      } catch (err) {
        console.error('Failed to delete soft-deleted user during Google login:', err);
        await signOut(auth);
      }
      throw new Error('No account exist');
    }
    
    // Check if they already exist in admins first!
    const adminDocRef = doc(db, 'admins', result.user.uid);
    const adminDoc = await getDoc(adminDocRef);
    if (adminDoc.exists()) {
      const data = adminDoc.data() as any;
      data.role = 'admin';
      setUser(data as UserData);
      return data as UserData;
    }
    
    // Check if they already exist in users
    if (userDoc.exists()) {
      const data = userDoc.data() as UserData;
      setUser(data);
      return data;
    }
    
    // Brand new user via Google
    const role = 'user';
    
    const newDocRef = doc(db, 'users', result.user.uid);
    const userData: UserData = {
      uid: result.user.uid,
      email,
      name: result.user.displayName || email.split('@')[0],
      role
    };
    await setDoc(newDocRef, userData);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    if (!email) throw new Error('Email is required to reset password');
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('This email is not registered yet.');
      }
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
    if (adminDoc.exists()) {
      const data = adminDoc.data() as any;
      data.role = 'admin';
      setUser(data as UserData);
    } else {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUser(data);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authSettings, login, loginWithGoogle, logout, resetPassword, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
