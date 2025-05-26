"use client";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function ResetPasswordSent() {
  const theme = useTheme();
  return (
    <>
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
                <h1 className="text-5xl font-semibold tracking-tight">
                  Tracker
                </h1>
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
          <div className="w-full max-w-sm space-y-8 text-center">
            <div className="flex items-center gap-2 justify-center">
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
              <h2 className="text-xl font-semibold tracking-tight">
                Reset Password Email Sent
              </h2>
            </div>
            <p>
              Check your inbox for the reset password link. If it&apos;s not
              there, check your spam or junk folder.
            </p>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full " />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
