"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function PasswordChangeSuccess() {
  const theme = useTheme();
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left Section */}
      <div className="relative hidden bg-zinc-900 p-8 text-white md:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-900/50" />
        <div className="relative z-20">
          <div className="mt-[35vh] max-w-md">
            <div className="mt-[35vh] max-w-md">
              <h1 className="flex items-center gap-2 text-5xl font-semibold tracking-tight">
                Deep Work
              </h1>
              <h1 className="text-5xl font-semibold tracking-tight">Tracker</h1>
              <p className="mt-4 text-zinc-400">
                Monitor and improve your productivity by tracking focused deep
                work sessions. Build better work habits one session at a time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <Image
                src={`/deepwork_${theme.theme === "light" ? "light" : "dark"}_logo.svg`}
                alt="Deepwork Logo"
                width={40}
                height={40}
              />
            </div>
            <p className="text-xl font-semibold">Deepwork.id</p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Password Changed Successfully
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You can now use your new password to sign in.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/sign-in">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
