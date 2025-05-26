"use client";
import DashboardNavbar from "@/components/generic/dashboard_navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";


function RootLayoutComponent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [session.status]);

  return (
    <main className="w-full h-full">
      <DashboardNavbar />
      {children}
      {/* <SessionManager /> */}
    </main>
  );
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="fixed w-full h-full bg-background" />}>
      <RootLayoutComponent>
        {children}
      </RootLayoutComponent>
    </Suspense>
  );
}
