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
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile-store";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";

const DashboardNavbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const profile = useProfileStore();
  useProfile(); // don't delete this please
  return (
    <nav className="py-2 md:px-12 px-4">
      <ul className="flex md:items-center md:justify-between justify-between items-end">
        <StackedMenu />
        <li>
          <ul className="flex items-center space-x-2">
            <li className="flex items-center space-x-2 justify-between">
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
