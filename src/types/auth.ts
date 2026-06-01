export type UserRole = 'admin' | 'user';

export type UserData = {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  branch?: string;
};

export type AuthSettings = {
  allowNewAccountCreation: boolean;
  allowGoogleSignIn: boolean;
};

export type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  authSettings: AuthSettings;
  login: (email: string, password?: string, isSignUp?: boolean, name?: string, branch?: string) => Promise<UserData>;
  loginWithGoogle: () => Promise<UserData>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};