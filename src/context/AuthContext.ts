import { createContext } from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import type { IUserProfile } from "../types/profile";

export interface ISign {
  success: boolean;
  data?: {
    user: User | null;
    session?: Session | null;
  };
  error?: AuthError;
}

export type FeedMode =
  | "fresh"
  | "rising"
  | "discussion"
  | "rising_comments";

export interface AuthContextType {
  user: User | null;
  userProfile: IUserProfile | null;
  feedMode: FeedMode;

  signInWithEmail: (email: string, password: string) => Promise<ISign>;

  signInWithGoogle: () => Promise<ISign>;

  signInWithGitHub: () => Promise<ISign>;

  signUpWithEmail: (email: string, password: string) => Promise<ISign>;

  signOut: () => Promise<void>;

  getProfile: (user: User | null | undefined) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);