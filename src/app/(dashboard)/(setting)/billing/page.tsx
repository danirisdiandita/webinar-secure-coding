"use client";
import { ChevronsDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type React from "react"; // Import React
import {
  initializePaddle,
  Paddle,
} from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSubscriptionStore } from "@/store/subscription-store";
import { SubscriptionCard } from "@/components/bypage/setting/subscription/subscription_card";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { getHumanReadableDate, getHumanReadablePrice } from "@/utils/date_util";
import { toast } from "sonner";
import { Suspense } from "react";
import { SubscriptionStatus } from "@/types/subscription_status";

function BillingComponent() {
  const sessions = useSession();
  const [isMonthly, setIsMonthly] = useState(true);
  const [paddle, setPaddle] = useState<Paddle>();
  const subscription = useSubscriptionStore();
  const router = useRouter();
  // const [cheq

  // const handleCheckoutEvents = (event: CheckoutEventsData) => {
  //   setCheckoutData(event);
  // };

  useEffect(() => {
    initializePaddle({
      environment:
        process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
          ? "production"
          : "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN as string,
      // eventCallback: (event) => {
      //   if (event.data && event.name) {
      //     handleCheckoutEvents(event.data);
      //   }
      // },
      checkout: {
        settings: {
          displayMode: "overlay",
          theme: "dark",
          allowLogout: false,
          frameTarget: "paddle-checkout-frame",
          frameInitialHeight: 450,
          frameStyle:
            "width: 100%; background-color: transparent; border: none",
          successUrl: "/checkout/success",
        },
      },
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });

    fetch("/api/paddle/transaction", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          subscription.changeTransactions(data?.data?.transactions);
          subscription.changeTransactionPagination(data?.data?.pagination);
        }
      })
      .catch((err) => {
        if (err) {
          toast.error("Failed to fetch transactions", {
            position: "top-center",
          });
        }
      });
  }, []);

  const openCheckout = () => {
    if (!paddle) return;
    if (!sessions.data?.user?.email) {
      paddle?.Checkout.open({
        items: [
          {
            priceId: isMonthly
              ? (process.env.NEXT_PUBLIC_MONTHLY_PRICING_ID as string)
              : (process.env.NEXT_PUBLIC_YEARLY_PRICING_ID as string),
            quantity: 1,
          },
        ],
      });
    } else {
      paddle?.Checkout.open({
        customer: { email: sessions.data?.user?.email as string },
        items: [
          {
            priceId: isMonthly
              ? (process.env.NEXT_PUBLIC_MONTHLY_PRICING_ID as string)
              : (process.env.NEXT_PUBLIC_YEARLY_PRICING_ID as string),
            quantity: 1,
          },
        ],
      });
    }
  };

  const handleDownloadInvoice = async (transactionId: string) => {
    const res_ = await fetch(
      `/api/paddle/transaction/invoice?transaction_id=${transactionId}`,
      {
        method: "GET",
      }
    );
    const resJson = await res_.json();
    if (resJson?.data?.data?.url) {
      router.push(resJson?.data?.data?.url);
    } else {
      toast.error("Invoice not found", {
        position: "top-center",
      });
    }
  };

  const handleSeeMore = () => {
    if (
      subscription.transactions[subscription.transactions.length - 1]
        .transactionId
    ) {
      fetch(
        `/api/paddle/transaction?after=${subscription.transactions[subscription.transactions.length - 1].transactionId}`
      )
        .then((res) => res.json())
        .then((data) => {
          subscription.changeTransactions(data?.data?.transactions);
          subscription.changeTransactionPagination(data?.data?.pagination);
        })
        .catch((err) => {
          if (err) {
            toast.error("Failed to fetch transactions", {
              position: "top-center",
            });
          }
        });
    } else {
      toast.error("There is no more transaction", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground">
          Keep track of your subscription details, update your billing
          information, and control your account&apos;s payment
        </p>
      </div>

      {subscription.subscription?.status === SubscriptionStatus.ACTIVE ? (
        <SubscriptionCard
          status={subscription.subscription.status}
          currentPlan={subscription.subscription.name as string}
          nextBillingDate={subscription.subscription.next_billed_at as string}
          cancelledAt={subscription.subscription.cancelled_at as string}
          lastSubscriptionDate={subscription.subscription.previously_billed_at as string}
          onCancel={() => {
            router.push(subscription.subscription?.cancel_url as string);
          }}
          onUpdatePayment={() => {
            router.push(
              subscription.subscription?.updated_payment_method_url as string
            );
          }}
        />
      ) : (
        <>
          <div className="flex justify-end">
            <div className="inline-flex items-center rounded-full border p-1 bg-background">
              <Toggle
                pressed={isMonthly}
                onPressedChange={() => setIsMonthly(true)}
                className="px-4 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Monthly
              </Toggle>
              <Toggle
                className="px-4 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                pressed={!isMonthly}
                onPressedChange={() => setIsMonthly(false)}
              >
                Yearly
              </Toggle>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Free</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">$0.00</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded-full text-sm">
                    FREE
                  </span>
                </div>
                <Button className="w-full my-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Current Plan
                </Button>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckIcon className="h-5 w-5 text-primary" />1 Project
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckIcon className="h-5 w-5 text-primary" />1 Session per
                    day
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="relative bg-[#18181B] text-white">
              <div className="absolute inset-px rounded-lg bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat hover:animate-border"></div>
              <CardContent className="relative p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Pro</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {isMonthly ? `$10.00` : `$100.00`}
                      </span>
                      <span className="text-gray-400">
                        {isMonthly ? `/month` : `/year`}
                      </span>
                    </div>
                  </div>
                  <span className="bg-orange-500 px-2 py-1 rounded-full text-sm">
                    PRO
                  </span>
                </div>
                <Button
                  className="w-full my-4 bg-white text-black hover:bg-white/90"
                  onClick={openCheckout}
                >
                  Upgrade Plan
                </Button>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckIcon className="h-5 w-5 text-white" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckIcon className="h-5 w-5 text-white" />
                    Unlimited sessions per day
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Billing History</h2>
          {/* <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="w-[200px]" />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div> */}
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Amounts</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscription.transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.planName}</TableCell>
                  <TableCell>
                    {getHumanReadablePrice(transaction.price)}
                  </TableCell>
                  <TableCell>
                    {transaction.purchaseDate
                      ? getHumanReadableDate(new Date(transaction.purchaseDate))
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {transaction.endDate
                      ? getHumanReadableDate(new Date(transaction.endDate))
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-green-500 bg-green-50">
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={transaction.status !== "completed"}
                        onClick={() =>
                          handleDownloadInvoice(transaction.transactionId)
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination>
          <PaginationContent>
            {/* <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem> */}
            <PaginationItem>
              <Button
                variant="outline"
                onClick={handleSeeMore}
                disabled={subscription.transactionPagination.hasNext !== true}
              >
                <ChevronsDown className="h-4 w-4" />
                See More
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="h-28 sm:h-0"></div>
      </div>
    </div>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const BillingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillingComponent />
    </Suspense>
  );
};

export default BillingPage;
