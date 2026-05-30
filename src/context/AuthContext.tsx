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
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { AuthContextType, UserData } from '../types/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({} as UserData),
  loginWithGoogle: async () => ({} as UserData),
  logout: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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

        // Check if admin FIRST to prioritize admin rights if duplicate docs exist
        const adminDocRef = doc(db, 'admins', firebaseUser.uid);
        const adminDoc = await getDoc(adminDocRef);
        
        if (adminDoc.exists()) {
          const data = adminDoc.data() as any;
          data.role = 'admin';
          setUser(data as UserData);
        } else {
          // Check standard users
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
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

  const login = async (email: string, password?: string, isSignUp?: boolean): Promise<UserData> => {
    if (!password) throw new Error('Password is required');
    
    let userCredential;
    if (isSignUp) {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email immediately
      await sendEmailVerification(userCredential.user);
      
      // Sign out immediately so they cannot access the dashboard before verification
      await signOut(auth);
      
      const role = 'user';
      const name = email.split('@')[0].split(/[\.\-_]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
      
      return {
        uid: userCredential.user.uid,
        email,
        name,
        role
      };
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Enforce email verification (bypass for override admin account)
      if (!userCredential.user.emailVerified && email !== 'admin@freshhire.com') {
        try {
          // Courtesy resend of verification email
          await sendEmailVerification(userCredential.user);
        } catch (e) {
          console.error('Failed to resend verification email', e);
        }
        await signOut(auth);
        throw new Error('Your email is not verified yet. We have sent a new verification link to your inbox. Please check your spam folder as well.');
      }
      
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
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data() as any;
        data.role = 'admin';
        setUser(data as UserData);
        return data as UserData;
      } else {
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
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
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const email = result.user.email || '';
    
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
    const userDocRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userDocRef);
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

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
