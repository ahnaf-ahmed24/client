"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuEye, LuEyeOff, LuLoader } from "react-icons/lu";
import SocialButtons from "./SocialButtons";
import { useAuth } from "@/providers/AuthProvider";
import { apiPost } from "@/lib/api";
import { useSocialErrorToast } from "./useSocialErrorToast";
import type { PublicUser } from "@/lib/types";

const PASSWORD_RULES = [
  { key: "upper", label: "An uppercase letter (A–Z)", test: (value: string) => /[A-Z]/.test(value) },
  { key: "lower", label: "A lowercase letter (a–z)", test: (value: string) => /[a-z]/.test(value) },
  { key: "length", label: "At least 6 characters", test: (value: string) => value.length >= 6 },
];

export default function RegisterForm() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  useSocialErrorToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? Straight to the home page.
  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [authLoading, user, router]);

  const passwordChecks = PASSWORD_RULES.map((rule) => rule.test(password));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const allValid = passwordChecks.every(Boolean);
    if (!allValid) {
      toast.error(
        "Password must include an uppercase letter, a lowercase letter and be at least 6 characters."
      );
      return;
    }

    setSubmitting(true);
    try {
      await apiPost<{ user: PublicUser }>("auth/register", {
        name,
        email,
        photoURL,
        password,
      });
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          required
          placeholder="Your full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="input input-bordered w-full bg-base-100"
        />
      </div>

      <div>
        <label htmlFor="register-email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input input-bordered w-full bg-base-100"
        />
      </div>

      <div>
        <label htmlFor="register-photo" className="mb-1.5 block text-sm font-medium">
          Photo URL <span className="font-normal text-base-content/50">(optional)</span>
        </label>
        <input
          id="register-photo"
          type="text"
          placeholder="https://…"
          value={photoURL}
          onChange={(event) => setPhotoURL(event.target.value)}
          className="input input-bordered w-full bg-base-100"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="register-password" className="block text-sm font-medium">
            Password
          </label>
        </div>
        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`input input-bordered w-full bg-base-100 pr-11 ${
              password && !passwordChecks.every(Boolean) ? "input-error" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
          >
            {showPassword ? (
              <LuEyeOff aria-hidden className="size-4.5" />
            ) : (
              <LuEye aria-hidden className="size-4.5" />
            )}
          </button>
        </div>

       
        <ul className="mt-2.5 space-y-1.5 rounded-xl bg-base-200/60 px-3.5 py-3">
          {PASSWORD_RULES.map((rule, index) => {
            const passing = passwordChecks[index];
            return (
              <li
                key={rule.key}
                className={`flex items-center gap-2 text-xs ${
                  passing ? "text-success" : "text-base-content/50"
                }`}
              >
                <span
                  aria-hidden
                  className={`grid size-3.5 place-items-center rounded-full ${
                    passing ? "bg-success text-base-100" : "bg-base-300"
                  }`}
                >
                  {passing && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="size-2.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
                Must have {rule.label}
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary btn-lg w-full rounded-xl font-semibold"
      >
        {submitting && <LuLoader aria-hidden className="size-5 animate-spin" />}
        Register
      </button>

      <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-base-content/40">
        <span className="h-px flex-1 bg-base-300" />
        Or continue with
        <span className="h-px flex-1 bg-base-300" />
      </div>

      <SocialButtons showGithub />

      <p className="pt-2 text-center text-sm text-base-content/60">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
