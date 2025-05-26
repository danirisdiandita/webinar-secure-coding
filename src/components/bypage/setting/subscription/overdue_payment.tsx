"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverduePaymentBannerProps {
  daysOverdue: number;
  onPayNow: () => void;
}

export default function OverduePaymentBanner({
  daysOverdue,
  onPayNow,
}: OverduePaymentBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isClosing ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Payment Overdue
                </p>
                <p className="text-lg font-bold text-white">
                  Your payment is {daysOverdue}{" "}
                  {daysOverdue === 1 ? "day" : "days"} late! Update your payment to continue your subscription.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={onPayNow}
                variant="secondary"
                size="sm"
                className="bg-white text-red-500 hover:bg-red-100 transition-colors duration-200 font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg"
              >
                <CreditCard className="h-6 w-6" />
                Update Payment
              </Button>
              <button
                onClick={() => setIsClosing(true)}
                className="text-white hover:text-red-100 transition-colors duration-200"
                aria-label="Dismiss"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
