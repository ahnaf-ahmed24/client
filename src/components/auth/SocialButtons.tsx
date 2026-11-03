"use client";

import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu";
import { apiUrl } from "@/lib/api";

interface SocialButtonsProps {

  showGithub?: boolean;
}


export default function SocialButtons({ showGithub = false }: SocialButtonsProps) {
  const [pending, setPending] = useState<"google" | "github" | null>(null);

  const socialLogin = (provider: "google" | "github") => {
    if (pending) return;
    setPending(provider);
    const from = window.location.pathname.includes("register")
      ? "register"
      : "login";
    window.location.assign(apiUrl(`/auth/${provider}?from=${from}`));
  };

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => socialLogin("google")}
        disabled={pending !== null}
        className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-base-300 bg-base-100 text-sm font-medium transition-colors hover:bg-base-200 disabled:opacity-60"
      >
        <FaGoogle aria-hidden className="text-[#EA4335]" />
        {pending === "google" ? (
          <LuLoader aria-hidden className="size-4 animate-spin" />
        ) : (
          "Continue with Google"
        )}
      </button>

      {showGithub && (
        <button
          type="button"
          onClick={() => socialLogin("github")}
          disabled={pending !== null}
          className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-base-300 bg-base-100 text-sm font-medium transition-colors hover:bg-base-200 disabled:opacity-60"
        >
          <FaGithub aria-hidden />
          {pending === "github" ? (
            <LuLoader aria-hidden className="size-4 animate-spin" />
          ) : (
            "Continue with GitHub"
          )}
        </button>
      )}
    </div>
  );
}
