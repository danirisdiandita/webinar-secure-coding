"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
// import { resendVerificationEmail } from "../actions/resend-verification-email";
import Image from "next/image";
import { useTheme } from "next-themes";


export default function VerifyEmail() {
  const theme = useTheme();
  const params = useParams();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const email_ = JSON.parse(decodeURIComponent(params?.userData as string)).email;
      const first_name_ = JSON.parse(decodeURIComponent(params?.userData as string)).first_name;
      const last_name_ = JSON.parse(decodeURIComponent(params?.userData as string)).last_name;

      await fetch(`/api/resend-verification-email`, {
        method: "POST",
        body: JSON.stringify({
          email: email_,
          first_name: first_name_,
          last_name: last_name_,
        }),
      });

      setResendMessage("Verification email resent. Please check your inbox.");
    } catch (error) {
      if (error instanceof Error) {
        setResendMessage(
          "Failed to resend verification email. Please try again."
        );
      }
    } finally {
      setIsResending(false);
    }
  };

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
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-white">
            Please check your inbox to verify your email address.
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-4 dark:text-white">
            We&apos;ve sent a verification email to:
            <br />
            <span className="font-semibold">
              {params?.userData &&
                JSON.parse(decodeURIComponent(params?.userData as string))
                  .email}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-white">
            Click the link in the email to complete your registration. If you
            don&apos;t see the email, check your spam folder.
          </p>
        </div>
        <div className="space-y-4">
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isResending ? "Resending..." : "Resend Verification Email"}
          </Button>
          {resendMessage && (
            <p className="mt-2 text-sm text-white dark:text-white">{resendMessage}</p>
          )}
        </div>
      </div>
    </div>
  </div>
</>

  );
}
