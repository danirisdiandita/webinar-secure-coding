"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function ForgotPassword() {
  const theme = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleResetPassword = async (formData: FormData) => {
    const email = formData.get("email");
    try {
      // Handle password reset API call here
      setIsLoading(true);

      // src/app/api/auth/reset-password/route.ts

      fetch("/api/auth/reset-password-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            toast.success("Password reset link has been sent to your email", {
              position: "top-center",
            });
            router.push("/reset-password-sent");
          }
        })
        .catch((error) => {
          // console.error("Failed to send password reset email:", error);
          if (error) {
            toast.error("An error occurred. Please try again.", {
              position: "top-center",
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Redirect or take further action
    } catch (error) {
      // console.error("Failed to reset password:", error);
      if (error) {
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
        });
      }
      setIsLoading(false);
    }
  };

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
            <h2 className="text-xl font-semibold tracking-tight">
              Forgot Password?
            </h2>
          </div>
          <form
            className="space-y-4"
            action={async (formData) => {
              try {
                await handleResetPassword(formData);
                // const res = await login(formData.get("email") as string, formData.get("password") as string)
              } catch (error) {
                console.log("error from next auth sign in", error);
              }
            }}
          >
            <div className="space-y-2">
              <Label>Enter your email to send a password reset link</Label>
              <Input type="email" name="email" placeholder="Email" />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              {/* <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500">
                  Or with email
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
