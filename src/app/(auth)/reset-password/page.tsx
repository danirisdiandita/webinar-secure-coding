"use client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";

function ResetPasswordComponent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const newPassword = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    try {
      fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_password: newPassword,
          reset_token: searchParams.get("reset_token"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            toast.success("Password has been reset successfully", {
              position: "top-center",
            });
            router.push("/reset-password-success");
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            toast.error("An error occurred. Please try again.", {
              position: "top-center",
            });
          }
        });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
        });
      }
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
            <h2 className="text-3xl font-semibold tracking-tight">
              Reset Your Password
            </h2>
          </div>
          <form action={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Reset Password
            </Button>
          </form>

          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordComponent />
    </Suspense>
  );
}
