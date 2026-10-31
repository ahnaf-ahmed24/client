"use client";

import { useEffect } from "react";
import { toast } from "sonner";


export function useSocialErrorToast() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const socialError = params.get("socialError");
    if (!socialError) return;
    window.history.replaceState(null, "", window.location.pathname);

    const [slug, detail] = socialError.includes(":") ? socialError.split(":") : [socialError, ""];
    if (slug === "google-unconfigured" || slug === "github-unconfigured") {
      const providerName = slug.startsWith("google") ? "Google" : "GitHub";
      toast.error(
        `${providerName} sign-in isn't configured yet. Add ${providerName} OAuth credentials to server/.env (see .env.example).`
      );
    } else {
      const message = detail || socialError;
      toast.error(message.charAt(0).toUpperCase() + message.slice(1) + (/[.!?]$/.test(message) ? "" : "."));
    }
  }, []);
}
