import { useCallback, useEffect, useState, type ReactNode } from "react";

import { AuthError, type User } from "@supabase/supabase-js";

import { supabase } from "../config/supabase-client";
import type { IUserProfile } from "../types/profile";

import { AuthContext, type FeedMode, type ISign } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

const feedModes: FeedMode[] = [
  "fresh",
  "rising",
  "discussion",
  "rising_comments",
];

const randomFeedMode = feedModes[Math.floor(Math.random() * feedModes.length)];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);

  const [feedMode] = useState<FeedMode>(randomFeedMode);

  const getProfile = useCallback(
    async (profileUser: User | null | undefined): Promise<void> => {
      const id = profileUser?.id;

      if (!id) {
        setUserProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
        return;
      }

      setUserProfile(data);
    },
    [],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return;
      }

      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        await getProfile(currentUser);
      } else {
        setUserProfile(null);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        getProfile(currentUser);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getProfile]);

  const signUpWithEmail = async (
    email: string,
    password: string,
  ): Promise<ISign> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      console.error("Error signing up:", error);

      return {
        success: false,
        error,
      };
    }

    setUser(data.user);

    if (data.user) {
      await getProfile(data.user);
    }

    return {
      success: true,
      data,
    };
  };

  const signInWithEmail = async (
    email: string,
    password: string,
  ): Promise<ISign> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      setUser(data.user);
      await getProfile(data.user);

      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      console.error("Unexpected sign-in error:", error);

      return {
        success: false,
        error: {
          message: "An unexpected error occurred. Please try again.",
        } as AuthError,
      };
    }
  };

  const signInWithGitHub = async (): Promise<ISign> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
    };
  };

  const signInWithGoogle = async (): Promise<ISign> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
    };
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return;
    }

    setUser(null);
    setUserProfile(null);
  };

  const contextValue = {
    user,
    userProfile,
    feedMode,
    signInWithEmail,
    signInWithGoogle,
    signInWithGitHub,
    signUpWithEmail,
    signOut,
    getProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
