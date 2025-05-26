import useSWR from "swr";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile-store";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useProfile = () => {
  const pStore = useProfileStore();

  const { data, isLoading, error, mutate } = useSWR(
    "/api/auth/checkusername",
    fetcher,
    {
      onSuccess: (data, key, config) => {
        pStore.changeFirstName(data?.user?.first_name);
        pStore.changeLastName(data?.user?.last_name);
        pStore.changeUsername(data?.user?.username);
        pStore.changeProfilePicture(data?.user?.image);
        pStore.changeProfilePicturePreview(data?.user?.image);
      },
      onError: (error, key, config) => {
        if (error) {
          toast.error("Failed to fetch profile", {
            position: "top-center",
          });
        }
      },
    }
  );

  const updateProfile = async (formData: FormData) => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        toast.error("Failed to update profile", {
          position: "top-center",
        });
        return;
      }

      toast.success("Profile updated successfully", {
        position: "top-center",
      });

      mutate();
    } catch (error) {
      toast.error("Failed to update profile", {
        position: "top-center",
      });
    }
  };

  return { data, isLoading, error, updateProfile };
};
