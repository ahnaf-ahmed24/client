import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider"; // AuthProvider ইমপোর্ট করুন
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudioSpace",
  description: "Find and book your favorite studios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-base-100 font-sans text-base-content antialiased">
        {/* এখানে AuthProvider দিয়ে পুরো অ্যাপটি রেপ করা হয়েছে */}
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}