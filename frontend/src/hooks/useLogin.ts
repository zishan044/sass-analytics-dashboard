import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginUser, type LoginData } from "@/lib/api";
import { toast } from 'react-hot-toast'


export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => loginUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Welcome back!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Invalid credentials";
      toast.error(message);
    },
  });
};