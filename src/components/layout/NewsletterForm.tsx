"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { LuSend } from "react-icons/lu";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (!EMAIL_PATTERN.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("You're on the list! Studio news & offers are on their way.");
      setEmail("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Subscription failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full font-medium"
      >
        {submitting ? (
          <span className="loading loading-spinner loading-sm" aria-hidden />
        ) : (
          <LuSend aria-hidden className="size-4" />
        )}
        Subscribe
      </button>
    </form>
  );
}
