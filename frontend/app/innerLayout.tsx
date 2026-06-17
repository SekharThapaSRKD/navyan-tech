"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import type { ISession } from "@/lib/utils/types/auth.type";
import DataLoading from "@/components/user-components/layout/LoadingPage";

export default function InnerLayoutClient({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<ISession | null>(null);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    const fetchSession = async () => {
      const sess = await getSession();
      setSession(sess);
      setLoading(false);
    };

    fetchSession();
  }, []);

  if (loading) return <DataLoading />;

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {session?.user?.role === "admin" && !isAdminPage && (
          <Link
            href="/admin"
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:bg-primary/90"
            aria-label="Return to admin dashboard"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Admin Dashboard</span>
          </Link>
        )}
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
