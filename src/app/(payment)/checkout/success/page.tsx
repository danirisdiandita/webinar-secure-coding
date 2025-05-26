'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
// import { PoweredByPaddle } from "@/components/custom/setting/payment/powered_by_paddle";
import { BadgeCheck } from "lucide-react";

const SuccessfulCheckoutPage = () => {
  const session = useSession();
  return (
    <main>
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 px-6 flex items-center justify-center">
          <div className="flex flex-col items-center dark:text-white text-center">
            {/* <Image className="pb-12" src="/placeholder.svg" alt="Success icon" height={96} width={96} /> */}
            <BadgeCheck className="h-24 w-24" />
            <h1 className="text-4xl md:text-[80px] leading-9 md:leading-[80px] font-medium pb-6">
              Payment successful
            </h1>
            <p className="text-lg pb-16">
              Success! Your payment is complete, and you&apos;re all set.
            </p>
            <Button variant="secondary" asChild>
              <Link
                href={session.status === "authenticated" ? "/dashboard" : "/"}
              >
                {session.status === "authenticated"
                  ? "Go to Dashboard"
                  : "Go to Home"}
              </Link>
            </Button>
          </div>
        </div>
        {/* <div className="absolute bottom-0 w-full">
          <PoweredByPaddle />
        </div> */}
      </div>
    </main>
  );
};

export default SuccessfulCheckoutPage;
