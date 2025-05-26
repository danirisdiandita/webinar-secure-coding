"use client";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { getInitials } from "@/utils/string_util";
import { ModeToggle } from "./mode_toggle";
import StackedMenu from "@/components/generic/stacked_menu";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/store/subscription-store";
import {
  FolderKanban,
  LayoutDashboard,
  Loader2Icon,
  MenuIcon,
  SettingsIcon,
  SquareActivityIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useProfileStore } from "@/store/profile-store";
import Image from "next/image";
import { toast } from "sonner";
import { SubscriptionStatus } from "@/types/subscription_status";
import RenderIf from "./renderif";
import { useMobileMenuStore } from "@/store/mobile-menu-store";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import UpgradeButton from "./upgrade-button";

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
  },
];

const DashboardNavbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const subscription = useSubscriptionStore();
  const profile = useProfileStore();
  useProfile(); // don't delete this please

  const mobileMenuStore = useMobileMenuStore();
  return (
    <nav className="py-2 md:px-12 px-4">
      <ul className="flex md:items-center md:justify-between justify-between items-end">
        <Button
          className="md:hidden block w-fit h-fit"
          variant="outline"
          onClick={() => {
            mobileMenuStore.changeOpen(!mobileMenuStore.isOpen);
          }}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>

        <StackedMenu />
        <li>
          <ul className="flex items-center space-x-2">
            <li className="flex items-center space-x-2 justify-between">
              <RenderIf
                condition={
                  subscription.subscription?.status ===
                  SubscriptionStatus.FREE_TRIAL_EXPIRED
                }
              >
                <p className="hidden md:block">{`Your Free Trial has expired `}</p>
              </RenderIf>
              <RenderIf
                condition={
                  subscription.subscription?.status ===
                  SubscriptionStatus.FREE_TRIAL_ACTIVE
                }
              >
                <p className="hidden md:block">
                  {`Your Free Trial will expire in ${
                    subscription.subscription?.free_trial_ends_at
                      ? Math.floor(
                          (new Date(
                            subscription.subscription?.free_trial_ends_at
                          ).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : "N/A"
                  } days `}
                </p>
              </RenderIf>
              {subscription.subscription?.status ===
              SubscriptionStatus.ACTIVE ? (
                <></>
              ) : (
                <UpgradeButton />
              )}
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {profile.profilePicture ? (
                    <button className="flex items-center justify-center w-8 h-8 rounded-full">
                      <Image
                        key="profilePicture"
                        src={profile.profilePicture as string}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    </button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white"
                    >
                      <p>{getInitials(session?.user?.name ?? "")}</p>
                    </Button>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/billing")}>
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default DashboardNavbar;
