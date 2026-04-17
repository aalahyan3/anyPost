"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/app/lib/api";
import { usePathname } from "next/navigation";

export type User = {
  id: string;
  email: string;
  name?: string;
  // Add other user fields depending on your backend
  [key: string]: any;
};

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);              
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      // Adjust endpoint if expected e.g. /api/v1/auth/me
      const res = await api.get("/api/v1/auth/whoami");
      
      if (res.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error in UserProvider fetchUser:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];

  useEffect(() => {
    const isPublic = pathname === '/' || PUBLIC_PATHS.some(p => pathname.startsWith(p));
    if (!isPublic) {
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [pathname, fetchUser]);

  return (
    <UserContext.Provider value={{ user, loading, setUser, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
