import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export interface AstronautUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AstronautUser;
  token: string | null;
  isAuth: boolean;
}

const DEFAULT_ASTRONAUT: AstronautUser = {
  userId: '00000000-0000-0000-0000-000000000001',
  name: 'Cmdr. Elena Vance',
  email: 'elena.vance@artemis-crew.nasa.gov',
  role: 'astronaut',
};

const AuthContext = createContext<AuthState>({
  user: DEFAULT_ASTRONAUT,
  token: null,
  isAuth: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: DEFAULT_ASTRONAUT,
        token: null,
        isAuth: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}