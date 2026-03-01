import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  signInWithEmail: (email: string, password: string) => void;
  signInWithGoogle: () => void;
  signInWithGitHub: () => void;
  signUpWithEmail: (email: string, password: string) => void;
  user: User | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
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

  // Sign up
  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  // Sign in
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        console.error("Sign-in error:", error.message); // Log the error for debugging
        return { success: false, error: error.message }; // Return the error
      }

      // If no error, return success
      console.log("Sign-in success:", data);
      return { success: true, data }; // Return the user data
    } catch (error: any) {
      // Handle unexpected issues
      console.error("Unexpected error during sign-in:", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  const signInWithGitHub = () => {
    supabase.auth.signInWithOAuth({ provider: "github" });
  };
  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  const contextValue = {
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    user,
    signInWithGitHub,
    signOut,
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
