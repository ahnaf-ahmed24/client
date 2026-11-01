"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/providers/AuthProvider";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || user) return;

    const next = encodeURIComponent(window.location.pathname);
    router.replace(`/login?next=${next}`);
  }, [authLoading, user, router]);

  if (authLoading) return <PageLoader label="Checking your session…" />;
  if (!user) return <PageLoader label="Redirecting to login…" />;

  return <>{children}</>;
}
