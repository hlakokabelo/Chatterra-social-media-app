import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import type { Session, User } from "@supabase/supabase-js";

interface Isign {
  success: boolean;
  data?: {
    user: User | null;
    session?: Session | null;
  };
  error?: any;
}

export interface IUserProfile {
  username: string;
  id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
}

interface AuthContextType {
  signInWithEmail: (email: string, password: string) => Promise<Isign>;
  signInWithGoogle: () => Promise<Isign>;
  signInWithGitHub: () => Promise<Isign>;
  signUpWithEmail: (email: string, password: string) => Promise<Isign>;
  user: User | null;
  signOut: () => void;
  getProfile: (user: User | null | undefined) => Promise<void>;
  userProfile: IUserProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      getProfile(session?.user);
    });

    //Listen to any changes in supabase.auth
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    //prevents memory leaks
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  //
  const getProfile = async (
    userProfile: User | null | undefined,
  ): Promise<void> => {
    const id = userProfile?.id || user?.id;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    setUserProfile(data);
  };

  // Sign up
  const signUpWithEmail = async (
    email: string,
    password: string,
  ): Promise<Isign> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }
    setUser(data.user);

    return { success: true, data };
  };

  // Sign in
  const signInWithEmail = async (
    email: string,
    password: string,
  ): Promise<Isign> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        return { success: false, error: error.message }; // Return the error
      }

      setUser(data.user);
      return { success: true, data }; // Return the user data
    } catch (error: any) {
      // Handle unexpected issues
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  const signInWithGitHub = async (): Promise<Isign> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) return { success: false, error: error.message };

    return { success: true };
  };
  const signInWithGoogle = async (): Promise<Isign> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) return { success: false, error: error.message };

    return { success: true };
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  const contextValue = {
    userProfile,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    user,
    signInWithGitHub,
    signOut,
    getProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};
