import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerUser, type RegisterData } from "@/lib/api";
import { toast } from 'react-hot-toast'

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => registerUser(data),
    onSuccess: () => {
      toast.success("Account created! Please login.");
      router.push("/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Registration failed";
      toast.error(message);
    },
  });
};