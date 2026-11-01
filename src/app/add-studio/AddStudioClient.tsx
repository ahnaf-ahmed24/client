"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import StudioForm, { type StudioFormPayload } from "@/components/studios/StudioForm";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

export default function AddStudioClient() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload: StudioFormPayload) => {
    setSubmitting(true);
    try {
      await apiPost<{ studio: unknown }>("studios", payload);
      toast.success("Studio listed successfully!", {
        description: "It's now live on the Explore page.",
      });
      router.push("/my-listings");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not add the studio. Try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <StudioForm
      mode="create"
      host={{ name: user?.name ?? "", email: user?.email ?? "" }}
      submitting={submitting}
      onSubmit={(payload) => void handleSubmit(payload)}
    />
  );
}
