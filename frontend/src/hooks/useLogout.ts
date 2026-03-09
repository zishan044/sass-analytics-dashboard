import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast"
import { api } from "@/lib/api";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
};