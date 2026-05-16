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
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'admin' | 'user';

export type UserData = {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
};

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password?: string, isSignUp?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user doc
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserData);
        } else {
          // Check if admin
          const adminDocRef = doc(db, 'admins', firebaseUser.uid);
          const adminDoc = await getDoc(adminDocRef);
          
          if (adminDoc.exists()) {
            setUser(adminDoc.data() as UserData);
          } else {
            // Fallback if doc doesn't exist yet but user is authenticated
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              role: firebaseUser.email === 'admin@freshhire.com' ? 'admin' : 'user'
            });
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string, isSignUp?: boolean) => {
    if (!password) throw new Error('Password is required');
    
    let userCredential;
    try {
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please log in.');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      }
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Authentication is not enabled. Please enable Email/Password provider in Firebase Console.');
      }
      throw new Error(error.message || 'Authentication failed.');
    }
    
    // Save or update user in Firestore
    if (isSignUp && userCredential) {
      try {
        const role = email === 'admin@freshhire.com' ? 'admin' : 'user';
        const name = email.split('@')[0].split(/[\.\-_]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
        
        const userData: UserData = {
          uid: userCredential.user.uid,
          email,
          name,
          role
        };
        
        const collectionName = role === 'admin' ? 'admins' : 'users';
        await setDoc(doc(db, collectionName, userCredential.user.uid), userData);
        setUser(userData);
      } catch (dbError: any) {
        console.error("Firestore Error:", dbError);
        if (dbError.code === 'permission-denied') {
          throw new Error('Account created, but database access was denied. Please update Firestore Security Rules.');
        }
        throw new Error('Account created, but failed to save user profile to database.');
      }
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const email = result.user.email || '';
    const role = email === 'admin@freshhire.com' ? 'admin' : 'user';
    const collectionName = role === 'admin' ? 'admins' : 'users';
    
    const userDocRef = doc(db, collectionName, result.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    let userData: UserData;
    if (!userDoc.exists()) {
      userData = {
        uid: result.user.uid,
        email,
        name: result.user.displayName || email.split('@')[0],
        role
      };
      await setDoc(userDocRef, userData);
    } else {
      userData = userDoc.data() as UserData;
    }
    setUser(userData);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    if (!email) throw new Error('Email is required to reset password');
    
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        throw new Error('This email is not registered yet.');
      }
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
