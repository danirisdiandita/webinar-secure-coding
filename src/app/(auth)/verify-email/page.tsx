"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function EmailVerificationSuccessParams() {
  const searchParams = useSearchParams();
  const extraParamsObject = Object.fromEntries(searchParams.entries());
  const router = useRouter();
  useEffect(() => {
    fetch("/api/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(extraParamsObject),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success("Email has been verified successfully", {
            position: "top-center",
          });
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error("An error occurred. Please try again."); // Display the error message
        }
      });
  }, [extraParamsObject]);
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left Section */}
      <div className="relative hidden bg-zinc-900 p-8 text-white md:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-900/50" />
        <div className="relative z-20">
          <p className="text-sm font-medium">01/03</p>
          <div className="mt-[35vh] max-w-md">
            <h1 className="flex items-center gap-2 text-5xl font-semibold tracking-tight">
              Create
              <span className="rounded-full bg-white/10 p-1">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 7l10 10M7 17L17 7" />
                </svg>
              </span>
            </h1>
            <h1 className="text-5xl font-semibold tracking-tight">
              Custom Cards
            </h1>
            <p className="mt-4 text-zinc-400">
              Design personalized cards that reflect your style and identity
              with our easy-to-use customization tools.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -left-20 top-0 h-[280px] w-[440px] rotate-[-12deg] rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-700 shadow-xl" />
              <div className="h-[280px] w-[440px] rotate-[15deg] rounded-2xl bg-gradient-to-r from-zinc-700 to-zinc-800 shadow-xl">
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-red-500/20">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-red-600 to-red-500" />
                    </div>
                    <p className="text-sm text-zinc-400">Account number</p>
                  </div>
                  <p className="mt-2 font-mono">**** **** **** 9568</p>
                  <p className="mt-6 text-2xl font-semibold">Rp. 48,238,120</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
              S
            </div>
            <p className="text-xl font-semibold">Deepwork.id</p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-center">
              Email Verified
            </h2>
            <p className="mt-4 text-center text-lg">
              Thank you! Your email has been successfully verified.
            </p>
          </div>
          <div className="text-center">
            <button
              className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
              onClick={() => router.push("/sign-in")}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailVerificationSuccess() {
  return (
    <Suspense>
      <EmailVerificationSuccessParams />
    </Suspense>
  );
}
