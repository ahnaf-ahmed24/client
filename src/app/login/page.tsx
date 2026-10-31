import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to StudioSpace to book creative studios, manage listings and track your bookings.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Login to your account"
      subtitle="Book studios, track bookings and manage your listings — all from one dashboard."
    >
      <LoginForm />
    </AuthShell>
  );
}
