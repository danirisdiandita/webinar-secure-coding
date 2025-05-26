import { useSubscriptionStore } from "@/store/subscription-store";
import { useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useSubscription = () => {
  const subscription = useSubscriptionStore();
  const { data, error, isLoading } = useSWR(
    "/api/paddle/subscription",
    fetcher
  );
  useEffect(() => {
    subscription.changeLoading(isLoading);
  }, [isLoading]);
  useEffect(() => {
    if (data?.data) {
      subscription.changeSubscription(data?.data);
    }
  }, [data]);

  return { subscription: data?.data, error, isLoading };
};
