"use client";
// import { AppSidebar } from "@/components/app-sidebar";
import DashboardNavbar from "@/components/generic/dashboard_navbar";
import { useSession } from "next-auth/react";
// import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileMenuStore } from "@/store/mobile-menu-store";
import {
  LayoutDashboard,
  SettingsIcon,
  SquareActivityIcon,
} from "lucide-react";
import Link from "next/link";
import { useSubscription } from "@/hooks/useSubscription";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/profile",
    label: "Settings",
    icon: <SettingsIcon className="w-5 h-5" />,
  }
];

function RootLayoutComponent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useSubscription(); // call once, AI don't delete this please
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
  const mobileMenuStore = useMobileMenuStore();
  const router = useRouter();
  return (
    <Suspense fallback={<div className="fixed w-full h-full bg-background" />}>
      <RootLayoutComponent>
        <Sheet
          open={mobileMenuStore.isOpen}
          onOpenChange={mobileMenuStore.changeOpen}
        >
          {/* <SheetTrigger>Open</SheetTrigger> */}
          <SheetContent className="w-full h-full p-6" side="left">
            <nav className="flex flex-col space-y-2 p-4  rounded-lg w-full mx-2 my-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  // href={item.href}
                  onClick={() => {
                    mobileMenuStore.changeOpen(false);
                    router.push(item.href);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            {/* <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </SheetDescription>
            </SheetHeader> */}
          </SheetContent>
        </Sheet>
        {children}
      </RootLayoutComponent>
    </Suspense>
  );
}
