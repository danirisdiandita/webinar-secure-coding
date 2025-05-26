"use client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session.status]);

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left Section */}
      <div className="relative hidden bg-zinc-900 p-8 text-white md:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-900/50" />
        <div className="relative z-20">
          <div className="mt-[35vh] max-w-md">
            <div className="mt-[35vh] max-w-md">
              <h1 className="flex items-center gap-2 text-5xl font-semibold tracking-tight">
               Secure Coding 
              </h1>
              <h1 className="text-5xl font-semibold tracking-tight">Tracker</h1>
              <p className="mt-4 text-zinc-400">
                Membangun Kode yang Aman dan Tangguh dari Ancaman Siber
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Welcome back!
              <br />
              Sign in to continue 👋
            </h2>
          </div>
          <form
            className="space-y-4"
            action={async (formData) => {
              try {
                // const res = await login(formData.get("email") as string, formData.get("password") as string)
                const res = await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirect: false,
                });

                if (res?.error) {
                  toast.error("Invalid email or password", {
                    position: "top-center",
                  });
                } else {
                  toast.success("Logged in", { position: "top-center" });
                  // router.push("/dashboard");

                  fetch("/api/auth/checkusername", {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      // if (!data.user.username) {
                      //   router.push("/getting-started");
                      // } else {
                        router.push("/dashboard");
                      // }
                    });
                }
              } catch (error) {
                if (error) {
                  toast.error("Invalid email or password", {
                    position: "top-center",
                  });
                }
              }
            }}
          >
            <div>
              <Input type="email" name="email" placeholder="Email" />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
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
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign in
            </Button>
            <div className="text-right">
              <Link
                className="text-sm text-muted-foreground hover:underline"
                href="/forgot-password"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
          <div className="space-y-4">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-background px-2 text-zinc-500 dark:text-zinc-500">
                  Or with email
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  signIn("google", { redirectTo: "/dashboard" });
                }}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full disabled:cursor-not-allowed"
                disabled={true}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"
                    fill="currentColor"
                  />
                </svg>
                Sign in with Apple
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
