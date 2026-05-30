export type UserRole = 'admin' | 'user';

export type UserData = {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
};

export type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password?: string, isSignUp?: boolean, name?: string) => Promise<UserData>;
  loginWithGoogle: () => Promise<UserData>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};