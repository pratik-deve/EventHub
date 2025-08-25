"use client";

import api from "@/api/axiosInstance";
import { getUserProfile } from "@/api/userApi";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  username: string;
  avatar?: string;
  isOrganizer: boolean;
  subscriptionStatus: "none" | "trial" | "monthly" | "yearly";
  subscriptionExpiry?: string;
  trialStarted?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setUserProfilePic: (url: string) => Promise<void>;
  signIn: (login: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  signInWithGoogle: () => Promise<void>;
  becomeOrganizer: (plan: "trial" | "monthly" | "yearly") => Promise<void>;
  updateSubscription: (plan: "monthly" | "yearly") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const checkAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserProfile(); // Fetch user profile from the backend
        setUser({
          name: userData.username,
          email: userData.email,
          username: userData.username,
          avatar: userData.profilePicUrl,
          isOrganizer: userData.role?.some(
            (r: { authority: string }) => r.authority === "ORGANIZER"
          ) || false,
          subscriptionStatus: "none",
        });
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null); // Clear user state if the session is invalid
      } finally {
        setIsLoading(false);
      }
    };
  useEffect(() => {
      checkAuth();
    }, []);

  const signIn = async (login: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({
          login,
          password,
        }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();

      const userData: User = {
        name: data.user.username,
        username: data.user.username,
        email: data.user.email,
        avatar: data.user.profilePicUrl,
        isOrganizer:
          data.user.role?.some(
            (r: { authority: string }) => r.authority === "ORGANIZER"
          ) || false,
        subscriptionStatus: "none",
      };

      setUser(userData);
    } catch (error) {
      throw new Error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      const userData: User = {
        name: username,
        username: username,
        email: email,
        avatar: "/placeholder.svg?height=40&width=40",
        isOrganizer: false,
        subscriptionStatus: "none",
      };

      setUser(userData);
    } catch (error) {
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };



const signInWithGoogle = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      setIsLoading(true);

      const popup = window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_GOOGLE}`,
        "GoogleLogin",
        "width=600,height=600"
      );

      const listener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return; // security check

        if (event.data.type === "OAUTH_LOGIN_SUCCESS") {

           sessionStorage.setItem("auth_token", event.data.token as string);
           setUser(event.data.user);

          window.removeEventListener("message", listener);
          popup?.close();
          resolve(event.data.user); // ✅ resolve promise
        }
      };

      window.addEventListener("message", listener);
    } catch (error) {
      reject(error);
    } finally {
      setIsLoading(false);
    }
  });
};


  const setUserProfilePic = async (url: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: url };
      setUser(updatedUser);
    }
  };

  const becomeOrganizer = async (plan: "trial" | "monthly" | "yearly") => {
    if (!user) throw new Error("User not authenticated");

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedUser: User = {
        ...user,
        isOrganizer: true,
        subscriptionStatus: plan,
        subscriptionExpiry:
          plan === "trial"
            ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(
                Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
              ).toISOString(),
        trialStarted: plan === "trial" ? new Date().toISOString() : undefined,
      };

      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw new Error("Failed to upgrade to organizer");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (plan: "monthly" | "yearly") => {
    if (!user) throw new Error("User not authenticated");

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedUser: User = {
        ...user,
        subscriptionStatus: plan,
        subscriptionExpiry: new Date(
          Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw new Error("Failed to update subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signout`, {
      method: "POST",
      credentials: "include", // clear cookie
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        becomeOrganizer,
        updateSubscription,
        setUserProfilePic,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
