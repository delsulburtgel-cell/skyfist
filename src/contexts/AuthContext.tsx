import { useState, useEffect, createContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signingIn: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ data; error: Error | null }>;
  signOut: () => Promise<void>;
}

export type { AuthContextType };

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const checkAdmin = async (userId: string) => {
    setIsAdmin(Boolean(userId));
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("onAuthStateChange", _event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setSigningIn(false);
      console.log(session);
      if (session?.user) {
        await checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
      setLoading(true);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdmin(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("signIn called, setting signingIn to true");
    setSigningIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("signInWithPassword returned", { data, error });

      if (data?.user) {
        // Check admin immediately here
        await checkAdmin(data.user.id);
        setUser(data.user);
        setSession(data.session ?? null);
      }

      setSigningIn(false);
      return { data, error: error as Error | null };
    } catch (err) {
      setSigningIn(false);
      console.log("signIn error", err);
      return { data: null, error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, isAdmin, loading, signingIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
