"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { ModeToggle } from "../generic/mode_toggle";
import Image from "next/image";
import RenderIf from "../generic/renderif";
import { LayoutDashboardIcon, Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLogoStore } from "@/store/logo-store";

const Navbar = () => {
  const session = useSession();
  const theme = useTheme();
  const logoStore = useLogoStore();
  useEffect(() => {
    if (theme.theme === "system") {
      if (theme.systemTheme === "dark") {
        logoStore.changeUrl("/logo_dark.svg");
      } else {
        logoStore.changeUrl("/logo.svg");
      }
    } else {
      logoStore.changeUrl(
        theme.theme === "dark" ? "/logo_dark.svg" : "/logo.svg"
      );
    }
  }, [theme]);
  return (
    <>
      <nav className="py-4 md:px-12 px-4 w-full z-50 bg-white/80 dark:bg-black/80 fixed">
        <ul className="flex justify-between items-center">
          <li>
            <Link
              href="/"
              className="font-bold text-lg flex justify-center space-x-2"
            >
              <Image
                src={logoStore.url}
                alt="Deepwork Logo"
                width={32}
                height={32}
              />

              <h1 className="hidden md:block">
                {process.env.NEXT_PUBLIC_PRODUCT_NAME}
              </h1>
            </Link>
          </li>
          
          <RenderIf condition={session.status === "authenticated"}>
            <li>
              <ul className="flex items-center space-x-2">
                <li>
                  <ModeToggle />
                </li>
                <li>
                  <Link href="/dashboard">
                    <Button className="font-semibold rounded-none w-36 flex  items-start">
                      <LayoutDashboardIcon />
                      <p className="hidden md:block">Dashboard</p>
                    </Button>
                  </Link>
                </li>
              </ul>
            </li>
          </RenderIf>
          <RenderIf condition={session.status === "loading"}>
            <li>
              <ul className="flex items-center space-x-2">
                <li>
                  <ModeToggle />
                </li>
                <li>
                  <Button
                    disabled
                    className="font-semibold rounded-none w-36 flex items-start"
                  >
                    <Loader2Icon className="animate-spin" />
                    <p className="hidden md:block">Please Wait...</p>
                  </Button>
                </li>
              </ul>
            </li>
          </RenderIf>
          <RenderIf condition={session.status === "unauthenticated"}>
            <li>
              <ul className="flex items-center space-x-2">
                <li>
                  <ModeToggle />
                </li>
                <li>
                  <Link href="/sign-in">
                    <Button
                      variant={"ghost"}
                      className="font-semibold rounded-none"
                    >
                      Login
                    </Button>
                  </Link>
                </li>

                <li className="hidden md:block">
                  <Link href="/sign-up">
                    <Button className="font-semibold rounded-none bg-amber-300 text-black border-black border-[2px] hover:bg-amber-500">
                      Sign Up
                    </Button>
                  </Link>
                </li>
              </ul>
            </li>
          </RenderIf>
        </ul>
      </nav>
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
