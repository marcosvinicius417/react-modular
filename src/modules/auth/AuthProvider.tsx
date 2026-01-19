import { createContext, useState } from "react";

export interface AuthData {
  userId: number;
  username: string;
  sessionId: string;
}

export type AuthContextData = {
  signed: boolean;
  authData: AuthData | null;
  redirectTo: string | null;
};

interface Props {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [authData] = useState<AuthData | null>(null);
  const [redirectTo] = useState<string | null>(null);

  return (
    <>
      <AuthContext.Provider
        value={{ signed: !!authData, authData, redirectTo }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
