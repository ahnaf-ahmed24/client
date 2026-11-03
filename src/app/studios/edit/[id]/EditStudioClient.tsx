"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LuCamera,
  LuCircleAlert,
  LuRotateCcw,
  LuTriangleAlert,
} from "react-icons/lu";
import PageLoader from "@/components/ui/PageLoader";
import StudioForm, { type StudioFormPayload } from "@/components/studios/StudioForm";
import { apiGet, apiPut } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import type { Studio } from "@/lib/types";

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; studio: Studio }
  | { kind: "forbidden"; studio: Studio };

export default function EditStudioClient({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const { studio } = await apiGet<{ studio: Studio }>(`studios/${id}`);
      if (
        !user ||
        studio.ownerEmail.toLowerCase() !== user.email.toLowerCase()
      ) {
        setState({ kind: "forbidden", studio });
        return;
      }
      setState({ kind: "ready", studio });
    } catch (error) {
      setState({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not load this studio. Please try again.",
      });
    }
  }, [id, user]);

  useEffect(() => {

    if (user) void load();
  }, [load, user]);

  const handleSubmit = (payload: StudioFormPayload) => {
    setSubmitting(true);
    void (async () => {
      try {
        await apiPut<{ studio: unknown }>(`studios/${id}`, payload);
        toast.success("Studio updated successfully!");
        router.push("/my-listings");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Update failed. Please try again."
        );
        setSubmitting(false);
      }
    })();
  };

  if (state.kind === "loading" || !user) {
    return <PageLoader label="Loading your listing…" />;
  }

  if (state.kind === "error") {
    return (
      <div
        role="alert"
        className="mt-8 rounded-2xl border border-error/30 bg-error/5 px-6 py-12 text-center"
      >
        <LuTriangleAlert aria-hidden className="mx-auto size-8 text-error" />
        <h2 className="mt-3 font-heading text-lg font-semibold">
          Couldn&apos;t load this studio
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
          {state.message}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => void load()}
            className="btn btn-outline btn-primary gap-2 rounded-full px-6"
          >
            <LuRotateCcw aria-hidden className="size-4" />
            Try again
          </button>
          <Link
            href="/my-listings"
            className="btn btn-ghost rounded-full px-6 text-base-content/70"
          >
            Back to my listings
          </Link>
        </div>
      </div>
    );
  }

  if (state.kind === "forbidden") {
    return (
      <div
        role="alert"
        className="mt-8 rounded-2xl border border-warning/40 bg-warning/5 px-6 py-12 text-center"
      >
        <LuCircleAlert aria-hidden className="mx-auto size-8 text-warning" />
        <h2 className="mt-3 font-heading text-lg font-semibold">
          This listing belongs to another host
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
          You can only edit studios published under your own account
          ({user.email}). This one is owned by {state.studio.ownerEmail}.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/my-listings"
            className="btn btn-primary rounded-full px-6 font-medium"
          >
            Go to my listings
          </Link>
          <Link
            href={`/studios/${state.studio._id}`}
            className="btn btn-ghost rounded-full px-6 text-base-content/70"
          >
            View the studio
          </Link>
        </div>
      </div>
    );
  }

  const { studio } = state;
  const title = studio.title;

  return (
    <>
      <div className="mt-5 flex items-center gap-2 text-xs text-base-content/50">
        <LuCamera aria-hidden className="size-3.5 text-primary" />
        Editing{" "}
        <span className="max-w-60 truncate font-semibold text-base-content/75">
          {title}
        </span>
        <Link
          href={`/studios/${studio._id}`}
          className="font-medium text-primary hover:underline"
        >
          (view public page)
        </Link>
      </div>

      <StudioForm
        mode="edit"
        initial={studio}
        host={{ name: user.name, email: user.email }}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </>
  );
}
