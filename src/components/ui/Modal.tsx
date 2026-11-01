"use client";

import { useEffect } from "react";
import { LuX } from "react-icons/lu";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg";
  busy?: boolean;
  children: React.ReactNode;
}

const WIDTHS: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
};


export default function Modal({
  open,
  onClose,
  title,
  size = "md",
  busy = false,
  children,
}: ModalProps) {
  
  useEffect(() => {
    if (!open || busy) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-neutral/70 p-4 backdrop-blur-sm"
      onClick={() => !busy && onClose()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={`rise my-8 w-full ${WIDTHS[size]} rounded-2xl border border-base-300 bg-base-100 shadow-2xl shadow-black/20`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-base-200 px-5 py-4">
          <h3 className="font-heading text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close dialog"
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 disabled:opacity-40"
          >
            <LuX aria-hidden className="size-4.5" />
          </button>
        </div>

        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
