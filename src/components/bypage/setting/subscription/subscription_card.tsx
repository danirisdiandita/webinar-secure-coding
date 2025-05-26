import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHumanReadableDate } from "@/utils/date_util";
import OverduePaymentBanner from "./overdue_payment";
import { CreditCard } from "lucide-react";

interface SubscriptionCardProps {
  status: string;
  currentPlan: string;
  nextBillingDate: string;
  cancelledAt: string;
  lastSubscriptionDate: string;
  onCancel: () => void;
  onUpdatePayment: () => void;
}

export function SubscriptionCard({
  status,
  currentPlan,
  nextBillingDate,
  cancelledAt,
  lastSubscriptionDate,
  onCancel,
  onUpdatePayment,
}: SubscriptionCardProps) {
  return (
    <div className="w-full">
      {status === "past_due" && (
        <OverduePaymentBanner
          daysOverdue={Math.floor(
            (new Date().getTime() - new Date(nextBillingDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )}
          onPayNow={onUpdatePayment}
        />
      )}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between md:block">
                <h3 className="text-lg font-semibold">Current Plan</h3>
                <p className="font-medium text-primary">{currentPlan}</p>
              </div>
              <div className="space-y-1">
                <p
                  className={`text-sm text-muted-foreground ${cancelledAt && "text-red-500"}`}
                >
                  {nextBillingDate &&
                    `Next billing date: ${getHumanReadableDate(new Date(nextBillingDate))}`}
                  {cancelledAt &&
                    `Cancelled at: ${getHumanReadableDate(new Date(cancelledAt))}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last subscription:{" "}
                  {getHumanReadableDate(new Date(lastSubscriptionDate))}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={onUpdatePayment}
                className="w-full sm:w-auto"
              >
                <CreditCard className="h-4 w-4" />
                Update Payment
              </Button>
              <Button
                variant="destructive"
                onClick={onCancel}
                className="w-full sm:w-auto"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
