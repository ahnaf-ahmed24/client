import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a StudioSpace account to book creative studios or list your own space.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join StudioSpace"
      title="Create your account"
      subtitle="Book creative studios by the hour — or list your own space and start earning."
    >
      <RegisterForm />
    </AuthShell>
  );
}
