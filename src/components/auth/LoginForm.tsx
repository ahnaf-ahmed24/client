"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuEye, LuEyeOff, LuLoader } from "react-icons/lu";
import SocialButtons from "./SocialButtons";
import { useAuth } from "@/providers/AuthProvider";
import { useSocialErrorToast } from "./useSocialErrorToast";

export default function LoginForm() {
  const { user, authLoading, login } = useAuth();
  const router = useRouter();
  useSocialErrorToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [authLoading, user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const fresh = await login(email, password);
      toast.success(`Welcome back, ${fresh.name}!`);
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="login-email"
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
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-medium">
            Password
          </label>
          <button
            type="button"
            onClick={() => toast.info("Password reset isn't available yet.")}
            className="text-xs font-medium text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input input-bordered w-full bg-base-100 pr-11"
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
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary btn-lg w-full rounded-xl font-semibold"
      >
        {submitting && <LuLoader aria-hidden className="size-5 animate-spin" />}
        Login
      </button>

      <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-base-content/40">
        <span className="h-px flex-1 bg-base-300" />
        Or continue with
        <span className="h-px flex-1 bg-base-300" />
      </div>

      <SocialButtons />

      <p className="pt-2 text-center text-sm text-base-content/60">
        New to StudioSpace?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
