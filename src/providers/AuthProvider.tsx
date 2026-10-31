"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { PublicUser, Studio, WishlistItem } from "@/lib/types";

interface AuthContextValue {
  user: PublicUser | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<PublicUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<PublicUser | null>;
  wishlistIds: string[];
  toggleWishlist: (studio: Studio) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const router = useRouter();

  const refreshWishlist = useCallback(async () => {
    const { items } = await apiGet<{ items: WishlistItem[] }>("wishlist");
    setWishlistIds(items.map((i) => i.studioId));
  }, []);

  const refreshUser = useCallback(async () => {
    const { user: fresh } = await apiGet<{ user: PublicUser }>("auth/me");
    setUser(fresh);
    if (fresh) {
      await refreshWishlist().catch(() => null);
    } else {
      setWishlistIds([]);
    }
    return fresh;
  }, [refreshWishlist]);

  useEffect(() => {
    apiGet<{ user: PublicUser | null }>("auth/me")
      .then(async ({ user: fresh }) => {
        setUser(fresh);
        if (fresh) await refreshWishlist().catch(() => null);
      })
      .catch(() => null)
      .finally(() => setAuthLoading(false));
  }, [refreshWishlist]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: loggedIn } = await apiPost<{ user: PublicUser }>(
        "auth/login",
        { email, password }
      );
      setUser(loggedIn);
      await refreshWishlist().catch(() => null);
      return loggedIn;
    },
    [refreshWishlist]
  );

  const logout = useCallback(async () => {
    await apiPost("auth/logout");
    setUser(null);
    setWishlistIds([]);
    router.push("/");
  }, [router]);

  const toggleWishlist = useCallback(
    async (studio: Studio) => {
      if (!user) throw new Error("Please log in to save studios.");
      const alreadySaved = wishlistIds.includes(studio._id);
      if (alreadySaved) {
        await apiDelete(`wishlist/${studio._id}`);
        setWishlistIds((ids) => ids.filter((id) => id !== studio._id));
        return false;
      }
      await apiPost("wishlist", { studioId: studio._id });
      setWishlistIds((ids) => [...ids, studio._id]);
      return true;
    },
    [user, wishlistIds]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        logout,
        refreshUser,
        wishlistIds,
        toggleWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
